// Web Worker Environment Polyfill for ppu-paddle-ocr and ppu-ocv
if (typeof self !== 'undefined') {
  if (typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype.getContext) {
    const origGetCtx = OffscreenCanvas.prototype.getContext;
    OffscreenCanvas.prototype.getContext = function (contextId: string, options?: any) {
      if (contextId === '2d') {
        options = { willReadFrequently: true, ...(options || {}) };
      }
      return origGetCtx.call(this, contextId as any, options);
    } as any;
  }

  if (typeof (self as any).document === 'undefined') {
    (self as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas' || (typeof tag === 'string' && tag.toLowerCase() === 'canvas')) {
          if (typeof OffscreenCanvas !== 'undefined') {
            const canvas = new OffscreenCanvas(300, 150);
            return canvas;
          }
        }
        return {
          getContext: () => null,
          style: {},
          setAttribute: () => {},
          appendChild: () => {},
        };
      },
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
    };
  }

  if (typeof (self as any).HTMLCanvasElement === 'undefined' && typeof OffscreenCanvas !== 'undefined') {
    (self as any).HTMLCanvasElement = OffscreenCanvas;
  }

  if (typeof (self as any).window === 'undefined') {
    (self as any).window = self;
  }
}

import * as ort from 'onnxruntime-web';
import { PaddleOcrService } from 'ppu-paddle-ocr/web';
import { detectTextPresenceInFrame, applyThresholdingNoiseFilter, applyUnsharpMask } from '../utils/ocrPreprocessing';
import { applyHardFilter, applySingleCjkFilter, applyLatinFilter, stripEmbeddedNoiseTokens, stripEdgeNoiseHanziTokens, correctOcrTextAnomalies } from '../utils/ocrPostprocessing';

// Pre-configure global ONNX runtime settings immediately
try {
  ort.env.logLevel = 'error';
  ort.env.wasm.simd = true;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = '/ort-wasm/';
  if (typeof (self as any) !== 'undefined') {
    (self as any).ort = ort;
  }
} catch (_) {}

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const parts = dataUrl.split(',');
  const base64 = parts.length > 1 ? parts[1] : parts[0];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function isLatinLanguage(lang?: string): boolean {
  if (!lang) return false;
  const l = lang.toLowerCase();
  return (
    l.startsWith('vi') ||
    l.startsWith('en') ||
    l.startsWith('fr') ||
    l.startsWith('es') ||
    l.startsWith('de') ||
    l.startsWith('id') ||
    l.startsWith('pt') ||
    l.startsWith('it') ||
    l.startsWith('ru') ||
    l.includes('tiếng việt') ||
    l.includes('english')
  );
}

function cleanOcrText(text: string, isLatin: boolean = false): string {
  if (!text) return '';
  let cleaned = text.replace(/[\x00-\x1F\x7F]/g, '').trim();
  cleaned = cleaned.replace(/[ \t]+/g, ' ').trim();
  if (isLatin) {
    cleaned = applyLatinFilter(cleaned, true);
  } else {
    cleaned = stripEdgeNoiseHanziTokens(stripEmbeddedNoiseTokens(cleaned));
  }
  return correctOcrTextAnomalies(cleaned);
}

let ocrService: PaddleOcrService | null = null;

function sanitizeDictionaryBuffer(buffer: ArrayBuffer | string): ArrayBuffer {
  let text = '';
  if (typeof buffer === 'string') {
    text = buffer;
  } else if (buffer && (buffer as ArrayBuffer).byteLength > 0) {
    text = new TextDecoder('utf-8').decode(buffer as ArrayBuffer);
  } else {
    return new ArrayBuffer(0);
  }
  // Strip UTF-8 BOM (\uFEFF) if present at the start
  if (text.charCodeAt(0) === 0xfeff || text.startsWith('\uFEFF')) {
    text = text.slice(1);
  }
  // Normalize CRLF (\r\n) and isolated \r to standard LF (\n)
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '');
  return new TextEncoder().encode(text).buffer;
}

function toArrayBuffer(buf: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (buf instanceof ArrayBuffer) return buf;
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function isProtobufValidHeader(buf: ArrayBuffer | null | undefined): boolean {
  if (!buf || buf.byteLength < 50000) return false;
  const u8 = new Uint8Array(buf, 0, Math.min(128, buf.byteLength));
  // Reject ASCII text errors: HTML, JSON, Git-LFS, XML
  if (u8[0] === 0x3c || u8[0] === 0x7b) { // '<' or '{'
    return false;
  }
  // Reject UTF-8 replacement character corruption \xEF\xBF\xBD
  if (u8.length >= 9 && u8[6] === 0xef && u8[7] === 0xbf && u8[8] === 0xbd) {
    return false;
  }

  const headStr = new TextDecoder('utf-8').decode(u8.subarray(0, 64)).toLowerCase();
  if (
    headStr.startsWith('<!doctype') ||
    headStr.startsWith('<html') ||
    headStr.startsWith('{"') ||
    headStr.includes('<html') ||
    headStr.includes('<!doc') ||
    headStr.includes('git-lfs') ||
    headStr.includes('version https://') ||
    headStr.includes('404 not found') ||
    headStr.includes('access denied')
  ) {
    return false;
  }
  return true;
}

const HF_DET_URL = 'https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_det_onnx/resolve/main/inference.onnx?download=true';
const HF_REC_URL = 'https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_rec_onnx/resolve/main/inference.onnx?download=true';

const DET_CANDIDATES = [
  '/det.onnx',
  '/api/paddle-models/det',
  '/api/ocr/model/det',
  HF_DET_URL,
];

const REC_CANDIDATES = [
  '/rec.onnx',
  '/api/paddle-models/rec',
  '/api/ocr/model/rec',
  HF_REC_URL,
];

const DICT_CANDIDATES = [
  '/dict.txt',
  '/api/paddle-models/dict',
  '/ppocrv6_tiny_dict.txt',
  '/api/ocr/model/dict',
  'https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.8/ppocr/utils/ppocr_keys_v1.txt',
  'https://huggingface.co/x3zvawq/paddleocr-js-onnx/resolve/main/ppocr_v5_mobile/ppocrv5_dict.txt',
  'https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv5_dict.txt',
];

async function fetchResourceBuffer(candidates: string[], isDict: boolean = false): Promise<ArrayBuffer | null> {
  for (const rawUrl of candidates) {
    const url = rawUrl.includes('huggingface.co') && rawUrl.includes('/blob/')
      ? rawUrl.replace('/blob/', '/resolve/')
      : rawUrl;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const cType = res.headers.get('content-type') || '';
      if (cType.toLowerCase().includes('text/html')) continue;
      const buf = await res.arrayBuffer();
      if (isDict) {
        if (buf && buf.byteLength > 10) return sanitizeDictionaryBuffer(buf);
      } else {
        if (buf && buf.byteLength > 50000 && isProtobufValidHeader(buf)) return buf;
      }
    } catch (_) {}
  }
  return null;
}

const CDN_ORT_WASM_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/';

async function resolveWasmPaths(): Promise<string | Record<string, string>> {
  try {
    const probe = await fetch('/ort-wasm/ort-wasm-simd-threaded.wasm', { method: 'GET' });
    if (probe.ok) {
      const cType = (probe.headers.get('content-type') || '').toLowerCase();
      if (!cType.includes('text/html')) {
        const ab = await probe.arrayBuffer();
        const u8 = new Uint8Array(ab);
        // Check WASM binary magic header: 0x00 0x61 0x73 0x6d ('\0asm') and minimum valid size (> 5MB)
        if (u8.length >= 5000000 && u8[0] === 0x00 && u8[1] === 0x61 && u8[2] === 0x73 && u8[3] === 0x6d) {
          return '/ort-wasm/';
        }
      }
    }
  } catch (_) {}

  // Fallback to high-speed CDN jsDelivr for complete WASM bundle matching installed version 1.23.2
  return CDN_ORT_WASM_BASE;
}

let isWorkerBusyHandling = false;
const workerIncomingQueue: MessageEvent[] = [];

self.onmessage = (e: MessageEvent) => {
  workerIncomingQueue.push(e);
  drainWorkerMessageQueue();
};

async function drainWorkerMessageQueue() {
  if (isWorkerBusyHandling || workerIncomingQueue.length === 0) return;
  isWorkerBusyHandling = true;
  const e = workerIncomingQueue.shift()!;
  try {
    await handleWorkerIncomingMessage(e);
  } finally {
    isWorkerBusyHandling = false;
    drainWorkerMessageQueue();
  }
}

async function handleWorkerIncomingMessage(e: MessageEvent) {
  const { type, detBuffer: incomingDet, recBuffer: incomingRec, dictBuffer: incomingDict, frames, workerId } = e.data;
  const currentWorkerId = typeof workerId === 'number' ? workerId : 1;

  if (type === 'INIT') {
    const hasWebGpu = typeof navigator !== 'undefined' && 'gpu' in navigator;

    try {
      try {
        const logicalCores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
        ort.env.logLevel = 'error';
        ort.env.wasm.simd = true;
        // Single thread per worker for task-parallel pool
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.proxy = false;
        
        // Dynamically resolve WASM paths with local magic header check & CDN jsDelivr fallback
        ort.env.wasm.wasmPaths = await resolveWasmPaths();

        // WebGPU power options
        if (typeof ort.env.webgpu === 'object' && ort.env.webgpu !== null) {
          (ort.env.webgpu as any).powerPreference = 'high-performance';
        }
        console.log(`[OCR Worker #${currentWorkerId}] WebGPU: ${hasWebGpu ? 'ACTIVE' : 'INACTIVE'} | Cores: ${logicalCores} | WASM Threads: ${ort.env.wasm.numThreads}`);
      } catch (envErr) {
        console.warn(`[OCR Worker #${currentWorkerId} Setup Warning]`, envErr);
      }

      if (!ocrService) {
        let detBuf = incomingDet && isProtobufValidHeader(incomingDet) ? incomingDet : null;
        let recBuf = incomingRec && isProtobufValidHeader(incomingRec) ? incomingRec : null;
        let cleanDictBuf = incomingDict && (incomingDict.byteLength > 10 || incomingDict.length > 10) ? sanitizeDictionaryBuffer(incomingDict) : null;

        if (!detBuf) {
          detBuf = await fetchResourceBuffer(DET_CANDIDATES);
        }

        if (!recBuf) {
          recBuf = await fetchResourceBuffer(REC_CANDIDATES);
        }

        if (!cleanDictBuf) {
          cleanDictBuf = await fetchResourceBuffer(DICT_CANDIDATES, true);
        }

        if (!detBuf || !recBuf) {
          throw new Error('Không thể tải tệp trọng số ONNX Model PaddleOCR');
        }

        const providers: string[] = ['wasm'];

        ocrService = new PaddleOcrService({
          model: {
            detection: toArrayBuffer(detBuf),
            recognition: toArrayBuffer(recBuf),
            charactersDictionary: cleanDictBuf ? toArrayBuffer(cleanDictBuf) : undefined,
          },
          detection: {
            thresh: 0.25,
            boxThresh: 0.55,
            box_thresh: 0.55,
            unclipRatio: 1.7,
            unclip_ratio: 1.7,
            minSize: 3,
            min_size: 3,
            scoreThresh: 0.35,
            dropScore: 0.35,
            drop_score: 0.35,
          } as any,
          recognition: {
            lang: 'ch',
            recAlgorithm: 'CRNN',
            rec_algorithm: 'CRNN',
            imageHeight: 48,
            recImageShape: [3, 48, 640],
            rec_image_shape: [3, 48, 640],
            recBatchNum: 64,
            rec_batch_num: 64,
            maxTextLength: 40,
            max_text_length: 40,
            dropScore: 0.35,
            drop_score: 0.35,
            useAngleCls: false,
            use_angle_cls: false,
          } as any,
          session: {
            executionProviders: providers,
            logSeverityLevel: 3,
            logVerbosityLevel: 0,
            graphOptimizationLevel: 'all',
          } as any,
          processing: {
            engine: 'canvas-native',
          },
        });
        await ocrService.initialize();
        if ((ocrService as any)?.platform) {
          (ocrService as any).platform.createCanvas = (_w: number, _h: number) => {
            const oc = new OffscreenCanvas(_w, _h);
            oc.getContext('2d', { willReadFrequently: true } as any);
            return oc;
          };
        }
        if ((ocrService as any)?.detector?.platform) {
          (ocrService as any).detector.platform.createCanvas = (ocrService as any).platform.createCanvas;
        }
        if ((ocrService as any)?.recognitor?.platform) {
          (ocrService as any).recognitor.platform.createCanvas = (ocrService as any).platform.createCanvas;
        }
      }
      console.log(`[OCR Worker #${currentWorkerId}] ppu-paddle-ocr initialized successfully!`);
      self.postMessage({
        type: 'READY',
        workerId: currentWorkerId,
        detReady: true,
        recReady: true,
      });
    } catch (err: any) {
      console.warn(`[OCR Worker #${currentWorkerId}] ppu-paddle-ocr init attempt 1 warning:`, err);
      try {
        // Enforce global CDN wasmPaths on fallback
        try {
          ort.env.wasm.wasmPaths = CDN_ORT_WASM_BASE;
          ort.env.wasm.numThreads = 1;
        } catch (_) {}

        if (!ocrService) {
          let detBuf = incomingDet && isProtobufValidHeader(incomingDet) ? incomingDet : null;
          let recBuf = incomingRec && isProtobufValidHeader(incomingRec) ? incomingRec : null;
          let cleanDictBuf = incomingDict && (incomingDict.byteLength > 10 || incomingDict.length > 10) ? sanitizeDictionaryBuffer(incomingDict) : null;

          if (!detBuf) {
            detBuf = await fetchResourceBuffer(DET_CANDIDATES);
          }

          if (!recBuf) {
            recBuf = await fetchResourceBuffer(REC_CANDIDATES);
          }

          if (!cleanDictBuf) {
            cleanDictBuf = await fetchResourceBuffer(DICT_CANDIDATES, true);
          }

          if (!detBuf || !recBuf) {
            throw new Error('Không thể tải tệp trọng số ONNX Model PaddleOCR cho chế độ WASM');
          }

          ocrService = new PaddleOcrService({
            model: {
              detection: toArrayBuffer(detBuf),
              recognition: toArrayBuffer(recBuf),
              charactersDictionary: cleanDictBuf ? toArrayBuffer(cleanDictBuf) : undefined,
            },
            session: {
              executionProviders: ['wasm'],
              logSeverityLevel: 3,
              logVerbosityLevel: 0,
              graphOptimizationLevel: 'all',
            } as any,
            processing: {
              engine: 'canvas-native',
            },
          });
          await ocrService.initialize();
          if ((ocrService as any)?.platform) {
            (ocrService as any).platform.createCanvas = (_w: number, _h: number) => {
              const oc = new OffscreenCanvas(_w, _h);
              oc.getContext('2d', { willReadFrequently: true } as any);
              return oc;
            };
          }
          if ((ocrService as any)?.detector?.platform) {
            (ocrService as any).detector.platform.createCanvas = (ocrService as any).platform.createCanvas;
          }
          if ((ocrService as any)?.recognitor?.platform) {
            (ocrService as any).recognitor.platform.createCanvas = (ocrService as any).platform.createCanvas;
          }
        }
        self.postMessage({ type: 'READY', workerId: currentWorkerId, detReady: true, recReady: true });
      } catch (fallbackErr: any) {
        console.error(`[OCR Worker #${currentWorkerId}] ppu-paddle-ocr init failed:`, fallbackErr);
        self.postMessage({ type: 'ERROR', workerId: currentWorkerId, error: fallbackErr?.message || 'Worker init error' });
      }
    }
  } else if (type === 'PROCESS_BATCH' && Array.isArray(frames)) {
    try {
      const results: { timestamp: number; text: string; confidence?: number; deepScan?: boolean }[] = [];
      let skippedFramesCount = 0;
      const { sourceLang, targetLang, enableDeepScan = true } = e.data;
      const isLatin = isLatinLanguage(sourceLang) || isLatinLanguage(targetLang);

      self.postMessage({
        type: 'PROGRESS',
        workerId: currentWorkerId,
        completed: 1,
        total: frames.length,
        progress: 10,
        message: `Worker #${currentWorkerId}: bóc tách song song ${frames.length} khung...`,
      });

      if (ocrService) {
        let usedOffscreen: OffscreenCanvas | null = null;
        let usedCtx: OffscreenCanvasRenderingContext2D | null = null;

        for (let i = 0; i < frames.length; i++) {
          const item = frames[i];
          if (!ocrService) break;

          try {
            let res: any = null;

            // High-Performance Path: Prioritize zero-copy transferred pixelData with OffscreenCanvas
            if (item.pixelData && item.width && item.height && item.width > 0 && item.height > 0) {
              if (item.pixelData.byteLength === 0 || (item.pixelData.buffer && item.pixelData.buffer.byteLength === 0)) {
                continue;
              }

              // Keep raw pixel data intact for optimal PaddleOCR DBNet & CRNN accuracy
              let typedArray: Uint8ClampedArray;
              if (item.pixelData instanceof Uint8ClampedArray) {
                typedArray = item.pixelData;
              } else if (item.pixelData instanceof ArrayBuffer) {
                typedArray = new Uint8ClampedArray(item.pixelData);
              } else if (item.pixelData && item.pixelData.buffer instanceof ArrayBuffer) {
                typedArray = new Uint8ClampedArray(item.pixelData.buffer, item.pixelData.byteOffset || 0, item.pixelData.length || (item.width * item.height * 4));
              } else {
                typedArray = new Uint8ClampedArray(item.pixelData);
              }

              if (typeof OffscreenCanvas !== 'undefined') {
                if (!usedOffscreen || usedOffscreen.width !== item.width || usedOffscreen.height !== item.height) {
                  usedOffscreen = new OffscreenCanvas(item.width, item.height);
                  usedCtx = usedOffscreen.getContext('2d', { willReadFrequently: true }) as any;
                }
                if (usedCtx && usedOffscreen) {
                  const imgData = new ImageData(typedArray, item.width, item.height);
                  usedCtx.putImageData(imgData, 0, 0);
                  // Tier 1 Fast Pass
                  res = await ocrService.recognize(usedOffscreen as any, { flatten: true });
                }
              }
            } else if (item.image && typeof item.image === 'string' && item.image.length > 30) {
              const arrayBuf = dataUrlToArrayBuffer(item.image);
              if (arrayBuf && arrayBuf.byteLength > 100) {
                res = await ocrService.recognize(arrayBuf, { flatten: true });
              }
            } else if (item.image && item.image instanceof ArrayBuffer && item.image.byteLength > 100) {
              res = await ocrService.recognize(item.image, { flatten: true });
            }

            let rawText = typeof res === 'string' ? res : res?.text || '';
            let confidence = typeof res === 'object' && res ? (res.confidence ?? res.score ?? 0.88) : 0.88;
            let text = cleanOcrText(rawText, isLatin);

            // Tier 2: Deep Scan (Parse-Tầng 2)
            // If Tier 1 produced empty text or very low confidence, re-process with unsharp sharpening & sensitive detection
            if ((!text || text.length === 0 || confidence < 0.35) && enableDeepScan && usedCtx && usedOffscreen && item.width && item.height) {
              try {
                applyUnsharpMask(usedCtx as any, item.width, item.height, 1.6, 1);
                const deepRes: any = await ocrService.recognize(usedOffscreen as any, {
                  flatten: true,
                  dropScore: 0.15,
                  scoreThresh: 0.15,
                } as any);

                const deepRaw = typeof deepRes === 'string' ? deepRes : deepRes?.text || '';
                const deepConf = typeof deepRes === 'object' && deepRes ? (deepRes.confidence ?? deepRes.score ?? 0.70) : 0.70;
                const deepCleaned = cleanOcrText(deepRaw, isLatin);

                if (deepCleaned && deepCleaned.length > 0 && deepConf >= 0.18) {
                  text = deepCleaned;
                  confidence = deepConf;
                  console.log(`[DeepScan Tầng-2] Khôi phục phụ đề mờ tại ${item.timestamp}s: "${text}" (${Math.round(confidence * 100)}%)`);
                }
              } catch (deepErr) {
                // Ignore deep scan failure gracefully
              }
            }

            const candidateMinConf = 0.20;
            if (text && confidence >= candidateMinConf && applyHardFilter(text, confidence, candidateMinConf, false)) {
              results.push({ timestamp: item.timestamp, text, confidence });
            }
          } catch (recErr) {
            console.warn(`[OCR Worker #${currentWorkerId}] Frame recognition exception for timestamp ${item.timestamp}:`, recErr);
          }
        }
      }

      self.postMessage({ type: 'BATCH_COMPLETE', workerId: currentWorkerId, results, skippedFramesCount });
    } catch (err: any) {
      self.postMessage({ type: 'ERROR', workerId: currentWorkerId, error: err?.message || 'Worker batch error' });
    }
  }
};
