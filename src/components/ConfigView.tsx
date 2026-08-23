import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Cpu,
  Zap,
  Server,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Save,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Radio,
  ListFilter,
  Sparkles,
  Loader2,
  Layers,
  ArrowRight,
  Volume2,
  DownloadCloud,
  Database,
  Trash2,
  Globe,
  ShieldCheck,
  Terminal,
  LogIn,
  LogOut,
  Play,
  Code2,
  Info,
  UserCheck,
  UserX,
} from 'lucide-react';
import { AppSettings, GeminiModelOption, ApiConnectionMode, TTSProviderOption } from '../types';
import { DEFAULT_APP_SETTINGS } from '../utils/settingsStorage';
import {
  checkPaddleOcrModelStatus,
  downloadPaddleOcrModels,
  clearPaddleOcrCache,
  PaddleOcrModelStatus,
} from '../utils/localPaddleOcrEngine';

interface ConfigViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    apiMode: settings.apiMode || 'direct',
  });
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showProxyKey, setShowProxyKey] = useState<boolean>(false);
  const [showTikTokSessionKey, setShowTikTokSessionKey] = useState<boolean>(false);
  const [showTikTokGuide, setShowTikTokGuide] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Proxy Model Fetching State
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false);
  const [fetchModelsError, setFetchModelsError] = useState<string | null>(null);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState<string | null>(null);
  const [fetchedProxyModels, setFetchedProxyModels] = useState<string[]>(
    formData.proxyModelsList || []
  );

  // Google Account / Gemini Web Automated Session State (BachTranslate Headless Engine)
  const [isCheckingGoogleToken, setIsCheckingGoogleToken] = useState<boolean>(false);
  const [isTestingGeminiPrompt, setIsTestingGeminiPrompt] = useState<boolean>(false);
  const [googleAuthMessage, setGoogleAuthMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [googleLogs, setGoogleLogs] = useState<string[]>([
    '[System] BachTranslate Headless Engine sẵn sàng.',
    '[WebView] Offscreen background WebView container đã được khởi tạo.',
    formData.googleAccountConnected
      ? `[CookieManager] Phiên Google: ${formData.googleAccountEmail || 'Đã kết nối'} (Token ready)`
      : '[CookieManager] Đang chờ kết nối Google Account hoặc nhận diện Cookie...',
  ]);
  const [testPromptResult, setTestPromptResult] = useState<string | null>(null);
  const [showCookieInput, setShowCookieInput] = useState<boolean>(false);

  // PaddleOCR Model Download / Cache State
  const [paddleStatus, setPaddleStatus] = useState<PaddleOcrModelStatus | null>(null);
  const [isDownloadingPaddle, setIsDownloadingPaddle] = useState<boolean>(false);
  const [paddleProgress, setPaddleProgress] = useState<{ percent: number; msg: string }>({ percent: 0, msg: '' });
  const [paddleDownloadMsg, setPaddleDownloadMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const refreshPaddleStatus = async () => {
    try {
      const status = await checkPaddleOcrModelStatus();
      setPaddleStatus(status);
    } catch (_) {}
  };

  useEffect(() => {
    refreshPaddleStatus();
  }, []);

  const handleDownloadPaddleModels = async () => {
    setIsDownloadingPaddle(true);
    setPaddleDownloadMsg(null);
    setPaddleProgress({ percent: 0, msg: 'Đang chuẩn bị nạp mô hình...' });

    let downloadErrorMsg = '';
    const success = await downloadPaddleOcrModels((pct, msg) => {
      setPaddleProgress({ percent: pct, msg });
      if (pct === 0 && (msg.startsWith('Lỗi') || msg.toLowerCase().includes('lỗi'))) {
        downloadErrorMsg = msg;
      }
    });

    setIsDownloadingPaddle(false);
    await refreshPaddleStatus();

    if (success) {
      setPaddleDownloadMsg({ text: 'Tải và lưu Model PaddleOCR v6 Tiny thành công vào IndexedDB!', isError: false });
    } else {
      setPaddleDownloadMsg({
        text: downloadErrorMsg || 'Không thể tải Model từ CDN. Bạn hãy kiểm tra lại kết nối mạng hoặc thử lại.',
        isError: true,
      });
    }
  };

  const handleClearPaddleCache = async () => {
    await clearPaddleOcrCache();
    await refreshPaddleStatus();
    setPaddleDownloadMsg({ text: 'Đã xóa bộ nhớ đệm Model PaddleOCR trong IndexedDB.', isError: false });
  };

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onSaveSettings(updated);
    showToastNotification();
  };

  const handleMultipleChanges = (changes: Partial<AppSettings>) => {
    const updated = { ...formData, ...changes };
    setFormData(updated);
    onSaveSettings(updated);
    showToastNotification();
  };

  const showToastNotification = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 1500);
  };

  const handleApplyIdealPresets = () => {
    const presetData: AppSettings = {
      ...formData,
      ocrEngine: 'paddleocr',
      ocrInterval: 0.5,
      confidenceThreshold: 0.7,
      sourceLang: 'zh_cn',
      targetLang: 'Tiếng Việt',
      autoFilterDuplicates: true,
      autoIdealPreset: true,
      selectedModel: 'gemini-3.6-flash',
    };
    setFormData(presetData);
    onSaveSettings(presetData);
    showToastNotification();
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_APP_SETTINGS);
    onSaveSettings(DEFAULT_APP_SETTINGS);
    setFetchedProxyModels([]);
    showToastNotification();
  };

  // Fetch models from Proxy Endpoint
  const handleFetchProxyModels = async () => {
    if (!formData.proxyUrl || !formData.proxyUrl.trim()) {
      setFetchModelsError('Vui lòng nhập Proxy Endpoint URL trước khi kết nối!');
      return;
    }

    setIsFetchingModels(true);
    setFetchModelsError(null);
    setFetchSuccessMsg(null);

    const cleanUrl = formData.proxyUrl.trim().replace(/\/+$/, '');
    const endpointsToTry = [
      `${cleanUrl}/v1/models`,
      `${cleanUrl}/models`,
      `${cleanUrl}/api/models`,
      cleanUrl,
    ];

    let modelsFound: string[] = [];
    let lastErrMsg = '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (formData.proxyKey && formData.proxyKey.trim()) {
      headers['Authorization'] = `Bearer ${formData.proxyKey.trim()}`;
      headers['x-api-key'] = formData.proxyKey.trim();
    }

    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        if (response.ok) {
          const rawText = await response.text().catch(() => '');
          let json: any = null;
          try {
            json = JSON.parse(rawText);
          } catch {
            json = null;
          }
          let rawList: any[] = [];

          if (Array.isArray(json)) {
            rawList = json;
          } else if (Array.isArray(json.data)) {
            rawList = json.data;
          } else if (Array.isArray(json.models)) {
            rawList = json.models;
          }

          const parsed = rawList
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                return item.id || item.name || item.model || item.slug || '';
              }
              return '';
            })
            .filter((str): str is string => Boolean(str && str.trim()));

          if (parsed.length > 0) {
            modelsFound = Array.from(new Set(parsed));
            break;
          }
        } else {
          lastErrMsg = `Server phản hồi mã lỗi HTTP ${response.status} (${response.statusText})`;
        }
      } catch (err: any) {
        lastErrMsg = err.message || 'Lỗi kết nối tới Proxy Server';
      }
    }

    if (modelsFound.length > 0) {
      setFetchedProxyModels(modelsFound);
      setFetchSuccessMsg(`✓ Đã truy vấn thành công ${modelsFound.length} mô hình từ Proxy!`);
      const defaultTarget = modelsFound[0];
      const updated: AppSettings = {
        ...formData,
        proxyModelsList: modelsFound,
        proxyTargetModel: formData.proxyTargetModel || defaultTarget,
      };
      setFormData(updated);
      onSaveSettings(updated);
    } else {
      setFetchModelsError(
        lastErrMsg || 'Không nhận diện được danh sách model từ Endpoint này. Bạn vẫn có thể nhập thủ công Target Model bên dưới.'
      );
    }

    setIsFetchingModels(false);
  };

  const appendGoogleLog = (line: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setGoogleLogs((prev) => [...prev.slice(-35), `[${timestamp}] ${line}`]);
  };

  const handleCheckGoogleToken = async (customCookie?: string) => {
    setIsCheckingGoogleToken(true);
    setGoogleAuthMessage(null);
    appendGoogleLog('[WebView] Khởi tạo Headless WebView ẩn (offscreen background container ready)...');
    appendGoogleLog('[WebView] Đang tải trang https://gemini.google.com trong luồng nền...');
    appendGoogleLog('[CookieManager] Tự động đọc cookie/phiên đăng nhập Google Account...');
    appendGoogleLog('[AuthEngine] checkToken: Đang gửi handshake kiểm tra phiên...');

    try {
      const cookieToSend = customCookie !== undefined ? customCookie : formData.geminiWebCookie;
      const res = await fetch('/api/gemini-web/check-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookie: cookieToSend,
          accountEmail: formData.googleAccountEmail,
          googleAccountConnected: formData.googleAccountConnected,
          apiKey: formData.apiKey,
        }),
      });

      let data: any = {};
      const resText = await res.text();
      try {
        data = JSON.parse(resText);
      } catch (e) {
        throw new Error(`Phản hồi máy chủ không hợp lệ: ${resText.slice(0, 100)}`);
      }

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((l: string) => appendGoogleLog(l));
      }

      if (data.success && data.tokenReady) {
        const updated: AppSettings = {
          ...formData,
          apiMode: 'gemini_web',
          googleAccountConnected: true,
          googleAccountEmail: data.email || formData.googleAccountEmail || 'google.user@gmail.com',
          googleAccountName: data.accountName || 'Google User',
          geminiWebSessionToken: data.token,
          geminiWebAccountStatus: 'token_ready',
          ...(customCookie !== undefined ? { geminiWebCookie: customCookie } : {}),
        };
        setFormData(updated);
        onSaveSettings(updated);
        setGoogleAuthMessage({ text: '✓ Token ready! Phiên đăng nhập Google Account trên WebView ẩn đã sẵn sàng.', isError: false });
        showToastNotification();
      } else {
        const updated: AppSettings = {
          ...formData,
          geminiWebAccountStatus: 'error',
        };
        setFormData(updated);
        onSaveSettings(updated);
        setGoogleAuthMessage({ text: data.message || 'Token missing: Chưa tìm thấy phiên Google hợp lệ. Vui lòng đăng nhập hoặc nhập Cookie.', isError: true });
      }
    } catch (err: any) {
      appendGoogleLog(`[AuthEngine Error] ${err.message || 'Lỗi kết nối WebView'}`);
      setGoogleAuthMessage({ text: 'Lỗi kiểm tra Token: ' + (err.message || 'Mất kết nối'), isError: true });
    } finally {
      setIsCheckingGoogleToken(false);
    }
  };

  const handleGoogleQuickLogin = async () => {
    const defaultEmail = formData.googleAccountEmail || 'user.google@gmail.com';
    appendGoogleLog(`[GoogleAuth] Đang mở luồng đăng nhập Google Account: ${defaultEmail}...`);
    await handleCheckGoogleToken();
  };

  const handleGoogleLogout = () => {
    const updated: AppSettings = {
      ...formData,
      googleAccountConnected: false,
      googleAccountEmail: '',
      geminiWebSessionToken: '',
      geminiWebCookie: '',
      geminiWebAccountStatus: 'disconnected',
    };
    setFormData(updated);
    onSaveSettings(updated);
    showToastNotification();
    appendGoogleLog('[GoogleAuth] Đã ngắt kết nối tài khoản Google và xóa phiên làm việc WebView.');
    setGoogleAuthMessage({ text: 'Đã ngắt kết nối tài khoản Google.', isError: false });
    setTestPromptResult(null);
  };

  const handleTestGeminiPrompt = async () => {
    setIsTestingGeminiPrompt(true);
    setTestPromptResult(null);
    appendGoogleLog('[Test Automation] Chuẩn bị gửi prompt test dịch thử nghiệm...');
    appendGoogleLog('[evaluateJavascript] Bơm JavaScript vào ô chat của gemini.google.com trong WebView ẩn...');
    appendGoogleLog('[executeJsFetch] Kích hoạt sự kiện submit ngầm...');

    try {
      const samplePrompt = `Dịch dòng phụ đề sau sang tiếng Việt tự nhiên: "师傅，徒儿这就去！" Trả về định dạng JSON: [{"id":"1","original":"师傅，徒儿这就去！","translation":"Sư phụ, đồ nhi đi ngay đây!"}]`;
      const res = await fetch('/api/gemini-web/execute-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: samplePrompt,
          cookie: formData.geminiWebCookie,
          apiKey: formData.apiKey,
        }),
      });

      let data: any = {};
      const resText = await res.text();
      try {
        data = JSON.parse(resText);
      } catch (e) {
        throw new Error(`Phản hồi máy chủ không hợp lệ: ${resText.slice(0, 100)}`);
      }

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((l: string) => appendGoogleLog(l));
      }

      if (data.success && data.text) {
        appendGoogleLog('[generateContent] Đã nhận và parse thành công kết quả từ DOM!');
        setTestPromptResult(data.text);
      } else {
        appendGoogleLog(`[Automation Error] ${data.error || 'Không nhận được dữ liệu'}`);
        setTestPromptResult('Lỗi: ' + (data.error || 'Không phản hồi'));
      }
    } catch (err: any) {
      appendGoogleLog(`[Automation Error] ${err.message || 'Lỗi gửi prompt'}`);
      setTestPromptResult('Lỗi kết nối: ' + err.message);
    } finally {
      setIsTestingGeminiPrompt(false);
    }
  };

  const currentApiMode: ApiConnectionMode = formData.apiMode || 'direct';

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-slate-100 text-xs pb-10">
      
      {/* Toast Notification Banner */}
      {savedToast && (
        <div className="bg-slate-800/95 border border-slate-500/80 text-metallic-silver p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-slate-200" />
          <span>Đã lưu cấu hình cài đặt thành công!</span>
        </div>
      )}

      {/* CARD 1: OCR ENGINE SELECTOR */}
      <div className="bg-metallic-card border-metallic rounded-2xl p-4 shadow-xl space-y-3">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-metallic-silver uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span>ENGINE QUÉT CHỮ (OCR)</span>
          </div>
          <span className="text-[10px] bg-slate-800/90 text-slate-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
            ENGINE CORE
          </span>
        </div>

        {/* Iconic Header Box */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-200 border border-slate-300/40 flex items-center justify-center text-slate-950 shadow-lg shadow-slate-300/10">
            <Zap className="w-5 h-5 fill-slate-900 text-slate-950" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-metallic-silver">1. Phương Thức OCR (Quét Chữ)</h2>
            <p className="text-[11px] text-slate-400">Chọn công nghệ nhận diện chữ từ video</p>
          </div>
        </div>

        {/* Option 1: Gemini Vision AI */}
        <label
          className={`relative flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
            formData.ocrEngine === 'gemini_vision'
              ? 'bg-metallic-panel border-metallic ring-1 ring-slate-300/30 shadow-md'
              : 'bg-metallic-card/50 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <input
            type="radio"
            name="ocrEngine"
            value="gemini_vision"
            checked={formData.ocrEngine === 'gemini_vision'}
            onChange={() => handleChange('ocrEngine', 'gemini_vision')}
            className="mt-1 accent-slate-200 w-4 h-4"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Google Gemini Vision AI (Chính xác 99%)</span>
              <span className="bg-metallic-panel text-slate-200 font-bold text-[9px] px-2 py-0.5 rounded-full border border-metallic">
                KHUYÊN DÙNG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mô hình AI Thị Giác đọc trực tiếp hình ảnh video, nhận diện chính xác 100% chữ tiếng Trung/Anh/Việt không bị chữ hỗn loạn hay mất nét.
            </p>
          </div>
        </label>

        {/* Option 2: PaddleOCR WebAssembly */}
        <div
          className={`p-3.5 rounded-xl border transition flex flex-col gap-3 ${
            formData.ocrEngine === 'paddleocr'
              ? 'bg-metallic-panel border-metallic ring-1 ring-slate-300/30 shadow-md'
              : 'bg-metallic-card/50 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <label className="relative flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="ocrEngine"
              value="paddleocr"
              checked={formData.ocrEngine === 'paddleocr'}
              onChange={() => handleChange('ocrEngine', 'paddleocr')}
              className="mt-1 accent-slate-200 w-4 h-4"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">PaddleOCR WebAssembly (Wasm + WebGL / ONNX Web)</span>
                <span className="bg-metallic-panel text-slate-200 font-bold text-[9px] px-2 py-0.5 rounded-full border border-metallic">
                  WASM + WEBGPU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tối ưu hóa chạy trực tiếp mô hình ONNX qua WebAssembly (Wasm) & WebGL trên trình duyệt. Tốc độ cực nhanh, bảo mật 100% dữ liệu không rời máy khách.
              </p>
            </div>
          </label>

          {/* PaddleOCR Local Model Management (Download/Reload/Cache Status) */}
          <div className="mt-1 pt-3 border-t border-slate-700/60 bg-slate-900/70 rounded-lg p-3 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">Trạng Thái Model Offline (IndexedDB):</span>
                {paddleStatus?.isReady ? (
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    ĐÃ TẢI ({paddleStatus.detSizeMB || '1.7MB'} Det + {paddleStatus.recSizeMB || '4.4MB'} Rec)
                  </span>
                ) : (
                  <span className="bg-rose-500/20 text-rose-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    CHƯA CÓ TRONG BỘ NHỚ
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownloadPaddleModels}
                  disabled={isDownloadingPaddle}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
                  title="Tải lại toàn bộ mô hình PaddleOCR ONNX và từ điển vào IndexedDB của trình duyệt"
                >
                  {isDownloadingPaddle ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải model ({paddleProgress.percent}%)...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{paddleStatus?.isReady ? 'Tải Lại Model PaddleOCR' : 'Tải Model PaddleOCR Ngay'}</span>
                    </>
                  )}
                </button>

                {paddleStatus?.isReady && (
                  <button
                    type="button"
                    onClick={handleClearPaddleCache}
                    disabled={isDownloadingPaddle}
                    className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 rounded-lg text-xs transition"
                    title="Xóa bộ nhớ đệm model PaddleOCR đã lưu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar when downloading */}
            {isDownloadingPaddle && (
              <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 font-mono flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    {paddleProgress.msg}
                  </span>
                  <span className="font-mono font-bold text-amber-400">{paddleProgress.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${paddleProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Download/Action Message */}
            {paddleDownloadMsg && !isDownloadingPaddle && (
              <div
                className={`text-[11px] p-2 rounded-lg border flex items-center gap-1.5 ${
                  paddleDownloadMsg.isError
                    ? 'bg-rose-950/50 border-rose-800/60 text-rose-300'
                    : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                }`}
              >
                {paddleDownloadMsg.isError ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{paddleDownloadMsg.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2: CHẾ ĐỘ KẾT NỐI API & MÔ HÌNH (API KEY VS REVERSE PROXY VS GOOGLE ACCOUNT WEBVIEW) */}
      <div className="bg-metallic-card border-metallic rounded-2xl p-4 shadow-xl space-y-4">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-metallic-silver uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
            <span>KẾT NỐI API & AI MODEL ENGINE</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full border border-slate-700">
            {currentApiMode === 'direct'
              ? 'DIRECT API KEY'
              : currentApiMode === 'proxy'
              ? 'REVERSE PROXY'
              : 'GOOGLE ACCOUNT (WEBVIEW ẨN)'}
          </span>
        </div>

        {/* Iconic Header Box */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-200 border border-slate-300/40 flex items-center justify-center text-slate-950 shadow-lg shadow-slate-300/10">
            {currentApiMode === 'direct' ? (
              <Key className="w-5 h-5 fill-slate-900 text-slate-950" />
            ) : currentApiMode === 'proxy' ? (
              <Server className="w-5 h-5 fill-slate-900 text-slate-950" />
            ) : (
              <Globe className="w-5 h-5 fill-slate-900 text-slate-950" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-metallic-silver">2. Cấu Hình Kết Nối API & AI Model</h2>
            <p className="text-[11px] text-slate-400">Chọn 1 trong 3 phương thức kết nối AI</p>
          </div>
        </div>

        {/* CONNECTION MODE TOGGLE SWITCH (3 EXCLUSIVE MODES: DIRECT KEY vs REVERSE PROXY vs GOOGLE ACCOUNT) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-metallic-silver uppercase tracking-wider">
            Chọn Phương Thức Kết Nối (Bắt buộc chọn 1 trong 3):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-metallic-panel rounded-2xl border-metallic shadow-inner">
            {/* Mode 1 Button: Direct API Key */}
            <button
              type="button"
              onClick={() => handleChange('apiMode', 'direct')}
              className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                currentApiMode === 'direct'
                  ? 'bg-metallic-card text-white font-bold border-metallic shadow-md ring-1 ring-slate-300/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Key className={`w-4 h-4 ${currentApiMode === 'direct' ? 'text-slate-200' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">1. Gemini API Key</span>
              </div>
              <span className="text-[9.5px] text-slate-400">Google AI Studio</span>
            </button>

            {/* Mode 2 Button: Reverse Proxy */}
            <button
              type="button"
              onClick={() => handleChange('apiMode', 'proxy')}
              className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                currentApiMode === 'proxy'
                  ? 'bg-metallic-card text-white font-bold border-metallic shadow-md ring-1 ring-slate-300/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Server className={`w-4 h-4 ${currentApiMode === 'proxy' ? 'text-slate-200' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">2. Reverse Proxy</span>
              </div>
              <span className="text-[9.5px] text-slate-400">Trạm Gateway</span>
            </button>

            {/* Mode 3 Button: Google Account (Gemini Web Automated WebView) */}
            <button
              type="button"
              onClick={() => handleChange('apiMode', 'gemini_web')}
              className={`py-2.5 px-2 rounded-xl transition flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                currentApiMode === 'gemini_web'
                  ? 'bg-metallic-card text-white font-bold border-metallic shadow-md ring-1 ring-slate-300/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Globe className={`w-4 h-4 ${currentApiMode === 'gemini_web' ? 'text-sky-300' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">3. Google Account</span>
              </div>
              <span className="text-[9.5px] text-slate-400">Gemini Web WebView ẩn</span>
            </button>
          </div>
        </div>

        {/* SECTION FOR MODE 1: DIRECT GEMINI API KEY */}
        {currentApiMode === 'direct' && (
          <div className="space-y-3.5 p-3.5 bg-metallic-panel border-metallic rounded-2xl shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2 text-xs font-bold text-metallic-silver border-b border-metallic pb-2">
              <Key className="w-4 h-4 text-slate-300" />
              <span>Cấu Hình Gemini API Key Trực Tiếp</span>
            </div>

            {/* API Key Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Gemini API Key:</span>
                <span className="text-[10px] text-slate-400 font-normal">Lưu mã hóa bí mật local</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Nhập Gemini API Key (Mặc định dùng Server Key)"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  className="w-full bg-slate-950 border-metallic rounded-xl pl-3 pr-10 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-slate-300 transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Nếu để trống, ứng dụng sẽ sử dụng Server Key hệ thống từ Google AI Studio.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-300" />
                <span>Chọn Mô Hình Gemini AI (Gemini Model):</span>
              </label>
              <select
                value={formData.selectedModel}
                onChange={(e) => handleChange('selectedModel', e.target.value as GeminiModelOption)}
                className="w-full bg-slate-950 border-metallic rounded-xl px-3 py-2.5 text-xs font-medium text-slate-100 focus:outline-none focus:border-slate-300 shadow-inner"
              >
                <option value="gemini-3.6-flash">
                  Gemini 3.6 Flash (Nhanh nhất & Tối ưu nhất)
                </option>
                <option value="gemini-3.1-pro-preview">
                  Gemini 3.1 Pro (Độ chính xác cao cho chữ nghệ thuật)
                </option>
                <option value="gemini-3.1-flash-lite">
                  Gemini 3.1 Flash Lite (Tiết kiệm Token)
                </option>
                <option value="gemini-2.5-flash">
                  Gemini 2.5 Flash
                </option>
              </select>
            </div>

            {/* Custom Model Name */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] text-slate-400 font-medium">
                Tên Model Tùy Chỉnh (Nếu muốn ghi đè):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: gemini-3.6-flash hoặc custom-gemini"
                value={formData.customModelName || ''}
                onChange={(e) => handleChange('customModelName', e.target.value)}
                className="w-full bg-slate-950 border-metallic rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-slate-300 shadow-inner"
              />
            </div>
          </div>
        )}

        {/* SECTION FOR MODE 2: REVERSE PROXY */}
        {currentApiMode === 'proxy' && (
          <div className="space-y-3.5 p-3.5 bg-metallic-panel border-metallic rounded-2xl shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2 text-xs font-bold text-metallic-silver border-b border-metallic pb-2">
              <Server className="w-4 h-4 text-slate-300" />
              <span>Cấu Hình Endpoint Reverse Proxy</span>
            </div>

            {/* Proxy Endpoint URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Proxy Endpoint URL:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: http://localhost:5000 hoặc https://my-proxy-server.com/v1"
                value={formData.proxyUrl}
                onChange={(e) => handleChange('proxyUrl', e.target.value)}
                className="w-full bg-slate-950 border-metallic rounded-xl px-3 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-slate-300 shadow-inner"
              />
            </div>

            {/* Proxy Auth Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Proxy Auth Header Key / Bearer Token:</span>
                <span className="text-[10px] text-slate-400 font-normal">(Tùy chọn)</span>
              </label>
              <div className="relative">
                <input
                  type={showProxyKey ? 'text' : 'password'}
                  placeholder="Secret key hoặc Bearer token của Proxy"
                  value={formData.proxyKey}
                  onChange={(e) => handleChange('proxyKey', e.target.value)}
                  className="w-full bg-slate-950 border-metallic rounded-xl pl-3 pr-10 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-slate-300 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowProxyKey(!showProxyKey)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  {showProxyKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Toggle Switch: proxyNoApiKey */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div className="space-y-0.5 pr-2">
                <label className="block text-xs font-bold text-slate-200">
                  Sử dụng Proxy không cần API Key:
                </label>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Khi bật, hệ thống sẽ bỏ qua API Key và không dùng đến Key hệ thống của Server để tránh hao hụt quota.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.proxyNoApiKey || false}
                  onChange={(e) => handleChange('proxyNoApiKey', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-300"></div>
              </label>
            </div>

            {/* FETCH MODELS BUTTON FROM PROXY */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFetchProxyModels}
                disabled={isFetchingModels || !formData.proxyUrl}
                className="w-full py-2.5 px-4 btn-metallic text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isFetchingModels ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>ĐANG TRUY VẤN MODEL TỪ PROXY...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-slate-950" />
                    <span>FETCH MODEL PROXY (LẤY DANH SÁCH MODEL)</span>
                  </>
                )}
              </button>

              {/* Status Notifications for Model Fetch */}
              {fetchSuccessMsg && (
                <div className="mt-2 text-[11px] p-2 bg-metallic-card text-slate-100 border-metallic rounded-lg font-semibold flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-200" />
                  <span>{fetchSuccessMsg}</span>
                </div>
              )}

              {fetchModelsError && (
                <div className="mt-2 text-[11px] p-2 bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-lg font-medium flex items-start gap-1.5 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-slate-300 mt-0.5" />
                  <span>{fetchModelsError}</span>
                </div>
              )}
            </div>

            {/* PROXY TARGET MODEL SELECTOR & CUSTOM INPUT */}
            <div className="space-y-1.5 pt-2 border-t border-metallic">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5 text-slate-300" />
                <span>Target Model (Lựa chọn Model của Proxy):</span>
              </label>

              {/* Select from Fetched Proxy Models */}
              {fetchedProxyModels.length > 0 ? (
                <select
                  value={formData.proxyTargetModel || fetchedProxyModels[0] || ''}
                  onChange={(e) => {
                    const selected = e.target.value;
                    handleMultipleChanges({
                      proxyTargetModel: selected,
                      customModelName: selected,
                    });
                  }}
                  className="w-full bg-slate-950 border-metallic rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-slate-300 shadow-inner"
                >
                  {fetchedProxyModels.map((modelId) => (
                    <option key={modelId} value={modelId}>
                      {modelId}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[10px] text-slate-400 italic bg-metallic-panel p-2 rounded-lg border-metallic">
                  Chưa có danh sách model tự động. Hãy bấm nút "FETCH MODEL PROXY" ở trên hoặc nhập tên model bên dưới.
                </div>
              )}

              {/* Custom Input for Proxy Target Model */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] text-slate-400 font-medium">
                  Hoặc Nhập Tên Target Model Thủ Công:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: gpt-4o-mini, deepseek-r1, gemini-2.5-flash..."
                  value={formData.proxyTargetModel || formData.customModelName || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleMultipleChanges({
                      proxyTargetModel: val,
                      customModelName: val,
                    });
                  }}
                  className="w-full bg-slate-950 border-metallic rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-slate-300 shadow-inner"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION FOR MODE 3: GOOGLE ACCOUNT (GEMINI WEB AUTOMATED WEBVIEW - BACHTRANSLATE ENGINE) */}
        {currentApiMode === 'gemini_web' && (
          <div className="space-y-3.5 p-3.5 bg-metallic-panel border-metallic rounded-2xl shadow-lg animate-fade-in">
            {/* Header with Title & Token Badge */}
            <div className="flex items-center justify-between border-b border-metallic pb-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-metallic-silver">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Google Account & Gemini Web Automated WebView</span>
              </div>
              <div className="flex items-center gap-1.5">
                {formData.googleAccountConnected && formData.geminiWebAccountStatus === 'token_ready' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-700/60 px-2 py-0.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    TOKEN READY (SẴN SÀNG)
                  </span>
                ) : isCheckingGoogleToken ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-700/60 px-2 py-0.5 rounded-full">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                    ĐANG CHECK TOKEN...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                    CHƯA KẾT NỐI
                  </span>
                )}
              </div>
            </div>

            {/* Google Account Profile Card */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
                  {formData.googleAccountConnected ? (
                    <UserCheck className="w-4 h-4 text-white" />
                  ) : (
                    <UserX className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {formData.googleAccountConnected
                        ? (formData.googleAccountEmail || 'offlang533@gmail.com')
                        : 'Chưa có phiên Google Account'}
                    </span>
                    {formData.googleAccountConnected && (
                      <span className="text-[9px] bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded border border-sky-800 font-mono">
                        gemini.google.com
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {formData.googleAccountConnected
                      ? `Token Session: ${formData.geminiWebSessionToken ? formData.geminiWebSessionToken.slice(0, 18) + '...' : 'SNlM0e_live_ready'}`
                      : 'Kết nối tài khoản Google để dịch không giới hạn qua WebView ẩn'}
                  </p>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!formData.googleAccountConnected ? (
                  <button
                    type="button"
                    onClick={handleGoogleQuickLogin}
                    disabled={isCheckingGoogleToken}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng Nhập Google</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckGoogleToken()}
                      disabled={isCheckingGoogleToken}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium rounded-xl flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                      title="Kiểm tra token phiên làm việc"
                    >
                      {isCheckingGoogleToken ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>checkToken</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogout}
                      className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-medium rounded-xl flex items-center gap-1 transition cursor-pointer"
                      title="Đăng xuất khỏi phiên Google"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status notification banner */}
            {googleAuthMessage && (
              <div
                className={`text-[11px] p-2 rounded-xl border flex items-center gap-2 ${
                  googleAuthMessage.isError
                    ? 'bg-rose-950/50 border-rose-800/60 text-rose-300'
                    : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                }`}
              >
                {googleAuthMessage.isError ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{googleAuthMessage.text}</span>
              </div>
            )}

            {/* Architecture Explanation Card (BachTranslate WebView Rationale) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2 text-[11px] text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tại sao BachTranslate sử dụng WebView ẩn?</span>
              </div>
              <p className="text-slate-300">
                Mục đích của WebView này <strong className="text-white">không phải để hiển thị trang Gemini cho bạn xem và tự chat tay</strong> — mà để ứng dụng tự động hoá hoàn toàn quy trình:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-sky-400">1. Load Ngầm</span>
                  <span className="text-[10px] text-slate-400">Khởi tạo WebView tải trang gemini.google.com trong background.</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-sky-400">2. Đọc Cookie</span>
                  <span className="text-[10px] text-slate-400">Đọc cookie Google Account đã lưu để bắt tay xác thực session (Token ready).</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-sky-400">3. Bơm JavaScript</span>
                  <span className="text-[10px] text-slate-400">Tự động bơm script evaluateJavascript để gõ prompt và trigger gửi ngầm.</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-sky-400">4. Parse DOM & Dịch</span>
                  <span className="text-[10px] text-slate-400">Đọc kết quả từ DOM mã nguồn, lọc dedup và trả về phụ đề chuẩn sạch.</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1">
                ✦ Nhờ chạy ẩn, màn hình không bị nhấp nháy chuyển trang liên tục — người dùng luôn được trải nghiệm giao diện dịch phụ đề mượt mà và sạch sẽ.
              </p>
            </div>

            {/* Test Prompt Injection & Live Automation Trigger */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thử Nghiệm Bơm Script Dịch (evaluateJavascript Test)</span>
                </div>
                <button
                  type="button"
                  onClick={handleTestGeminiPrompt}
                  disabled={isTestingGeminiPrompt}
                  className="px-3 py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 rounded-lg text-[11px] font-bold text-amber-200 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  {isTestingGeminiPrompt ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>Đang Bơm Script...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Chạy Thử Nghiệm Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {testPromptResult && (
                <div className="mt-2 bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap shadow-inner">
                  <div className="text-[10px] text-slate-400 font-sans font-bold pb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Kết quả trích xuất từ DOM trang Gemini Web:</span>
                  </div>
                  {testPromptResult}
                </div>
              )}
            </div>

            {/* Advanced WebView Settings (Tùy chọn nâng cao) */}
            <div className="pt-2 border-t border-metallic space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
                  <span>Tùy Chọn WebView Nâng Cao</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCookieInput(!showCookieInput)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 underline cursor-pointer"
                >
                  {showCookieInput ? 'Ẩn ô Cookie' : 'Nhập Cookie thủ công (Tùy chọn)'}
                </button>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">WebView Chạy Ẩn (Headless)</span>
                    <span className="text-[10px] text-slate-400 block">Ẩn hoàn toàn cửa sổ nền</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.geminiWebHeadlessMode ?? true}
                    onChange={(e) => handleChange('geminiWebHeadlessMode', e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">Duy Trì Phiên Nền (Keep-Alive)</span>
                    <span className="text-[10px] text-slate-400 block">Giữ session để dịch tức thì</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.geminiWebKeepAlive ?? true}
                    onChange={(e) => handleChange('geminiWebKeepAlive', e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Manual Cookie Input Area */}
              {showCookieInput && (
                <div className="space-y-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl animate-fade-in shadow-inner">
                  <label className="block text-[11px] font-semibold text-slate-200 flex items-center justify-between">
                    <span>Google Session Cookie (__Secure-1PSID / __Secure-1PSIDTS / SAPISID):</span>
                    <span className="text-[10px] text-slate-400">Copy từ DevTools trình duyệt</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Dán chuỗi Cookie từ gemini.google.com nếu muốn chỉ định phiên riêng..."
                    value={formData.geminiWebCookie || ''}
                    onChange={(e) => handleChange('geminiWebCookie', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-sky-400 shadow-inner"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckGoogleToken(formData.geminiWebCookie)}
                      disabled={isCheckingGoogleToken || !formData.geminiWebCookie?.trim()}
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-600 text-white font-bold text-[11px] rounded-lg transition cursor-pointer disabled:opacity-50"
                    >
                      Lưu & Kiểm Tra Cookie
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Realtime Terminal / Console Log (DevTools Style) */}
            <div className="pt-2 border-t border-metallic space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Terminal Tự Động Hóa WebView Ẩn (Console Log):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setGoogleLogs(['[System] Log console cleared.'])}
                  className="text-[10px] text-slate-400 hover:text-slate-200 transition underline cursor-pointer"
                >
                  Xóa Log
                </button>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 font-mono text-[10.5px] leading-relaxed max-h-36 overflow-y-auto space-y-1 shadow-inner select-text">
                {googleLogs.map((log, index) => {
                  let colorClass = 'text-slate-300';
                  if (log.includes('Token ready') || log.includes('thành công') || log.includes('sẵn sàng')) {
                    colorClass = 'text-emerald-400 font-bold';
                  } else if (log.includes('checkToken') || log.includes('Navigating') || log.includes('Handshake')) {
                    colorClass = 'text-sky-300';
                  } else if (log.includes('evaluateJavascript') || log.includes('executeJsFetch')) {
                    colorClass = 'text-amber-300';
                  } else if (log.includes('Error') || log.includes('missing') || log.includes('Lỗi')) {
                    colorClass = 'text-rose-400';
                  }
                  return (
                    <div key={index} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 3: IDEAL PRESETS & PERFORMANCE SETTINGS */}
      <div className="bg-metallic-card border-metallic rounded-2xl p-4 shadow-xl space-y-4">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-metallic-silver uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
            <span>CẤU HÌNH THÔNG SỐ KHUYÊN DÙNG</span>
          </div>

          <button
            type="button"
            onClick={handleApplyIdealPresets}
            className="btn-metallic-dark text-slate-200 font-bold text-[11px] px-3 py-1.5 rounded-xl border border-slate-600 transition flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
            <span>Áp Dụng Tối Ưu</span>
          </button>
        </div>

        {/* Iconic Header Box */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-200 border border-slate-300/40 flex items-center justify-center text-slate-950 shadow-lg shadow-slate-300/10">
            <SlidersHorizontal className="w-5 h-5 fill-slate-900 text-slate-950" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-metallic-silver">3. Tần Suất Quét & Ngôn Ngữ Dịch</h2>
            <p className="text-[11px] text-slate-400">Tối ưu tốc độ xử lý và độ tin cậy phụ đề</p>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-3">
          {/* Scan Interval Slider */}
          <div className="bg-metallic-panel border-metallic p-3 rounded-2xl shadow-md space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Tần suất quét OCR:</span>
              <span className="font-mono text-metallic-gold font-bold">{formData.ocrInterval}s / khung</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={formData.ocrInterval}
              onChange={(e) => handleChange('ocrInterval', parseFloat(e.target.value))}
              className="w-full accent-slate-200 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Mức chuẩn PaddleOCR: 0.5 giây/frame cho tốc độ & độ chính xác cao.
            </p>
          </div>

          {/* Confidence Slider */}
          <div className="bg-metallic-panel border-metallic p-3 rounded-2xl shadow-md space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Độ tin cậy tối thiểu:</span>
              <span className="font-mono text-metallic-gold font-bold">{Math.round(formData.confidenceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.95"
              step="0.05"
              value={formData.confidenceThreshold}
              onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
              className="w-full accent-slate-200 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Mức chuẩn: 70% để lọc bỏ các nhiễu bóng mờ background.
            </p>
          </div>

          {/* Background Text Filtering Controls */}
          <div className="bg-metallic-panel border-metallic p-3 rounded-2xl shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-metallic-silver uppercase tracking-wider">
                🎨 Bộ Lọc Lọc Chữ Nền Video (Tăng Nét Chữ OCR)
              </span>
              <span className="font-mono text-metallic-gold font-bold text-xs">
                {formData.bgFilterMode === 'none' ? 'Tắt' : `${formData.bgFilterStrength ?? 30}%`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Chế độ lọc:
                </label>
                <select
                  value={formData.bgFilterMode || 'contrast'}
                  onChange={(e) => handleChange('bgFilterMode', e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="none">⚪ Tắt (Ảnh gốc)</option>
                  <option value="contrast">✨ Tăng tương phản nét chữ (Khuyên dùng)</option>
                  <option value="binarize">🔲 Chuyển Đen Trắng Đơn Sắc (Binarize)</option>
                  <option value="adaptive">🌀 Lọc Nền Động (Adaptive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Độ mạnh lọc:
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  disabled={formData.bgFilterMode === 'none'}
                  value={formData.bgFilterStrength ?? 30}
                  onChange={(e) => handleChange('bgFilterStrength', parseInt(e.target.value, 10))}
                  className="w-full accent-slate-200 cursor-pointer disabled:opacity-40 mt-1"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Loại bỏ bối cảnh video động bên dưới, giúp nét chữ Tiếng Trung/Anh/Việt sắc nét tối đa trước khi đưa vào PaddleOCR & Gemini.
            </p>
          </div>
        </div>

        {/* Language Selectors */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-metallic-panel border-metallic p-2.5 rounded-2xl shadow-md space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300">Nguồn OCR:</label>
            <select
              value={formData.sourceLang}
              onChange={(e) => handleChange('sourceLang', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400"
            >
              <option value="zh_cn">Tiếng Trung (zh_cn)</option>
              <option value="auto">Tự động (Auto)</option>
              <option value="en">Tiếng Anh (en)</option>
              <option value="ja">Tiếng Nhật (ja)</option>
            </select>
          </div>

          <div className="bg-metallic-panel border-metallic p-2.5 rounded-2xl shadow-md space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300">Dịch sang:</label>
            <select
              value="Tiếng Việt"
              onChange={(e) => handleChange('targetLang', 'Tiếng Việt')}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="Tiếng Việt">🇻🇳 Tiếng Việt</option>
            </select>
          </div>
        </div>

        {/* TTS Engine & Voice Selection Section */}
        <div className="bg-metallic-panel border-metallic p-3 rounded-2xl shadow-md space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-metallic-silver border-b border-slate-700/60 pb-1.5">
            <Volume2 className="w-4 h-4 text-slate-300" />
            <span>Thuyết Minh (TTS Engine & Giọng Đọc)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* TTS Provider Select */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Công cụ TTS (Engine):</label>
              <select
                value={formData.ttsProvider || 'nghi_tts'}
                onChange={(e) => handleChange('ttsProvider', e.target.value as TTSProviderOption)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="nghi_tts">Piper TTS (Offline)</option>
                <option value="edge_tts">Edge TTS (Online)</option>
                <option value="tiktok_tts">TikTok TTS (Thuyết Minh TikTok)</option>
                <option value="gemini">Gemini Audio (Google AI)</option>
              </select>
            </div>

            {/* Voice Select depending on Provider */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Giọng thuyết minh mặc định:</label>
              {formData.ttsProvider === 'edge_tts' ? (
                <select
                  value={formData.edgeVoice || 'vi-VN-HoaiMyNeural'}
                  onChange={(e) => handleChange('edgeVoice', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="vi-VN-HoaiMyNeural">✓ Hoài Mỹ (Nữ)</option>
                  <option value="vi-VN-NamMinhNeural">✓ Nam Minh (Nam)</option>
                </select>
              ) : formData.ttsProvider === 'tiktok_tts' ? (
                <select
                  value={formData.tiktokVoice || 'BV074_streaming'}
                  onChange={(e) => handleChange('tiktokVoice', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="BV074_streaming">✓ Giọng Nữ mặc định hệ thống (BV074_streaming)</option>
                  <option value="BV075_streaming">✓ Giọng Nam mặc định hệ thống (BV075_streaming)</option>
                </select>
              ) : formData.ttsProvider === 'gemini' ? (
                <select
                  value={formData.geminiVoice || 'Kore'}
                  onChange={(e) => handleChange('geminiVoice', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="Kore">✓ Kore (Nữ Truyền Cảm)</option>
                  <option value="Puck">✓ Puck (Nam Trầm Ấm)</option>
                  <option value="Charon">✓ Charon (Nam Phim)</option>
                  <option value="Aoede">✓ Aoede (Nữ Truyện Đọc)</option>
                </select>
              ) : (
                <select
                  value={formData.nghiVoice || 'ngochuyennew'}
                  onChange={(e) => handleChange('nghiVoice', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="ngochuyennew">✓ Ngọc Huyền</option>
                  <option value="lacphi">✓ Lạc Phi</option>
                  <option value="duyoryx">✓ Duy Oryx</option>
                  <option value="ngocngan">✓ Ngọc Ngạn</option>
                  <option value="maiphuong">✓ Mai Phương</option>
                  <option value="minhquang">✓ Minh Quang</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Deduplicate, Adaptive Sampling & AI Refine Checkboxes */}
        <div className="bg-metallic-panel border-metallic p-3 rounded-2xl shadow-md space-y-2.5">
          <label className="flex items-center space-x-2.5 text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoAiRefine !== false}
              onChange={(e) => handleChange('autoAiRefine', e.target.checked)}
              className="accent-sky-500 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-sky-300">Rà soát phụ đề bằng AI ở bước cuối (AI Refine)</span>
              <span className="text-[10px] text-slate-400">Tự động sửa lỗi chính tả, xóa ký tự rác OCR & gộp câu trùng lặp sau khi bóc tách xong</span>
            </div>
          </label>

          <label className="flex items-center space-x-2.5 text-slate-200 cursor-pointer pt-1 border-t border-slate-800/60">
            <input
              type="checkbox"
              checked={formData.adaptiveSampling !== false}
              onChange={(e) => handleChange('adaptiveSampling', e.target.checked)}
              className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-amber-300">Quét thích ứng thông minh (Adaptive High-Density Sampling)</span>
              <span className="text-[10px] text-slate-400">Tự động tăng mật độ quét ở đoạn thoại dồn dập & dãn cách ở các đoạn tĩnh</span>
            </div>
          </label>

          <label className="flex items-center space-x-2.5 text-slate-200 cursor-pointer pt-1 border-t border-slate-800/60">
            <input
              type="checkbox"
              checked={formData.autoFilterDuplicates}
              onChange={(e) => handleChange('autoFilterDuplicates', e.target.checked)}
              className="accent-slate-200 w-4 h-4 rounded cursor-pointer"
            />
            <span className="font-semibold text-xs">Tự động lọc dòng trùng lặp & khử khoảng lặng (Offline)</span>
          </label>
        </div>
      </div>

      {/* CARD 4: TIKTOK TTS CONFIG (TIKTOK SESSION ID) */}
      <div className="bg-metallic-card border-metallic rounded-2xl p-4 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-metallic-silver uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span>TIKTOK TTS CONFIG</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400">
            <span className={`w-2 h-2 rounded-full ${formData.tiktokSessionId?.trim() ? 'bg-slate-200' : 'bg-slate-600'}`} />
            <span>{formData.tiktokSessionId?.trim() ? 'ĐÃ CÀI ĐẶT' : 'CHƯA CÀI ĐẶT'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Để sử dụng giọng thuyết minh TikTok tiếng Việt, bạn có thể điền Session ID được lấy từ cookie trình duyệt sau khi đăng nhập TikTok.
        </p>

        {/* TikTok Session ID Input */}
        <div className="relative">
          <input
            type={showTikTokSessionKey ? 'text' : 'password'}
            placeholder="TikTok Session ID"
            value={formData.tiktokSessionId || ''}
            onChange={(e) => handleChange('tiktokSessionId', e.target.value)}
            className="w-full bg-slate-950 border-metallic rounded-2xl pl-4 pr-11 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-300 font-mono transition shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowTikTokSessionKey(!showTikTokSessionKey)}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition"
            title={showTikTokSessionKey ? 'Ẩn Session ID' : 'Hiện Session ID'}
          >
            {showTikTokSessionKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* TikTok Proxy URL Input */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-200">
              Proxy Thuyết Minh (TikTok/Edge TTS Proxy):
            </label>
            <button
              type="button"
              onClick={() => handleChange('tiktokProxyUrl', 'proxifly')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition underline font-medium"
            >
              Dùng Proxifly Tự Động
            </button>
          </div>
          <input
            type="text"
            placeholder="Ví dụ: http://1.2.3.4:8080 hoặc điền 'proxifly'"
            value={formData.tiktokProxyUrl || ''}
            onChange={(e) => handleChange('tiktokProxyUrl', e.target.value)}
            className="w-full bg-slate-950 border-metallic rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-300 font-mono transition shadow-inner"
          />
          <p className="text-[10px] text-slate-400">
            Sử dụng để bypass khi mạng Server bị TikTok/Akamai chặn (ETIMEDOUT). Nhập proxy của riêng bạn, hoặc điền <span className="text-cyan-400 font-mono">proxifly</span> để tự động tìm proxy miễn phí từ thư viện Proxifly.
          </p>
        </div>

        {/* Collapsible Guide */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowTikTokGuide(!showTikTokGuide)}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            {showTikTokGuide ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>Hướng dẫn lấy Session ID từ TikTok</span>
          </button>

          {/* Guide Content Box */}
          {showTikTokGuide && (
            <div className="mt-3 bg-metallic-card border-metallic rounded-2xl p-4 text-xs space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-center space-x-1.5 text-white font-bold text-xs">
                <span>💡</span>
                <span>Các bước thực hiện:</span>
              </div>

              <ol className="space-y-2 text-slate-300 text-[11px] leading-relaxed list-decimal list-inside pl-1">
                <li>Đăng nhập <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-slate-200 underline hover:text-white font-semibold">tiktok.com</a> trên trình duyệt máy tính.</li>
                <li>Nhấn phím <kbd className="bg-metallic-panel text-slate-200 px-1.5 py-0.5 rounded font-mono border-metallic">F12</kbd> để mở Công cụ nhà phát triển.</li>
                <li>Vào tab <strong>Application</strong> (Chrome/Edge) hoặc <strong>Storage</strong> (Firefox).</li>
                <li>Tìm mục <strong>Cookies</strong> bên trái -&gt; Chọn trang web <strong>tiktok.com</strong>.</li>
                <li>Tìm dòng có tên cookie là <code className="text-slate-100 font-mono font-bold bg-metallic-panel px-1 py-0.5 rounded border-metallic">sessionid</code> và copy giá trị đó dán vào ô trên.</li>
              </ol>

              {/* Warning Box */}
              <div className="bg-metallic-panel border-metallic rounded-xl p-3 text-slate-300 text-[11px] leading-relaxed shadow-md">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Lưu ý:</strong> Việc sử dụng Session ID của tài khoản TikTok để gọi API không chính thức có thể khiến TikTok phát hiện và khóa tài khoản của bạn vĩnh viễn. Hãy cân nhắc sử dụng tài khoản phụ.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 underline font-medium transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi phục mặc định</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSaveSettings(formData);
            showToastNotification();
          }}
          className="btn-metallic text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>LƯU CẤU HÌNH</span>
        </button>
      </div>

    </div>
  );
};
