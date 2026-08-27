var fg=Object.defineProperty;var hg=(e,t,r)=>t in e?fg(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var ve=(e,t,r)=>hg(e,typeof t!="symbol"?t+"":t,r);/*!
 * ONNX Runtime Web v1.23.2
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ja=Object.defineProperty,mg=Object.getOwnPropertyDescriptor,gg=Object.getOwnPropertyNames,yg=Object.prototype.hasOwnProperty,_g=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),q=(e,t)=>()=>(e&&(t=e(e=0)),t),er=(e,t)=>{for(var r in t)Ja(e,r,{get:t[r],enumerable:!0})},bg=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of gg(t))!yg.call(e,n)&&n!==r&&Ja(e,n,{get:()=>t[n],enumerable:!(a=mg(t,n))||a.enumerable});return e},$r=e=>bg(Ja({},"__esModule",{value:!0}),e),nr,_t,Pt,Gs,Ld,qd=q(()=>{nr=new Map,_t=[],Pt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=nr.get(e);if(a===void 0)nr.set(e,{backend:t,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=_t.indexOf(e);n!==-1&&_t.splice(n,1);for(let i=0;i<_t.length;i++)if(nr.get(_t[i]).priority<=r){_t.splice(i,0,e);return}_t.push(e)}return}throw new TypeError("not a valid backend")},Gs=async e=>{let t=nr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(a){return r||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Ld=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),a=r.length===0?_t:r,n,i=[],s=new Set;for(let l of a){let d=await Gs(l);typeof d=="string"?i.push({name:l,err:d}):(n||(n=d),n===d&&s.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${i.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of i)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),wg=q(()=>{qd()}),Vd,vg=q(()=>{Vd="1.23.2"}),zi,Ae,jd=q(()=>{vg(),zi="warning",Ae={wasm:{},webgl:{},webgpu:{},versions:{common:Vd},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);zi=e}},get logLevel(){return zi}},Object.defineProperty(Ae,"logLevel",{enumerable:!0})}),le,$g=q(()=>{jd(),le=Ae}),Fd,Gd,xg=q(()=>{Fd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let a=r.getContext("2d");if(a!=null){let n,i;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[3]):(n=e.dims[3],i=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let c=i*n,h=0,m=c,_=c*2,y=-1;s==="RGBA"?(h=0,m=c,_=c*2,y=c*3):s==="RGB"?(h=0,m=c,_=c*2):s==="RBG"&&(h=0,_=c,m=c*2);for(let b=0;b<i;b++)for(let x=0;x<n;x++){let $=(e.data[h++]-d[0])*l[0],w=(e.data[m++]-d[1])*l[1],C=(e.data[_++]-d[2])*l[2],S=y===-1?255:(e.data[y++]-d[3])*l[3];a.fillStyle="rgba("+$+","+w+","+C+","+S+")",a.fillRect(x,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Gd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(r!=null){let n,i,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[1],s=e.dims[3]):(n=e.dims[3],i=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let h=i*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let m=4,_=0,y=1,b=2,x=3,$=0,w=h,C=h*2,S=-1;u==="RGBA"?($=0,w=h,C=h*2,S=h*3):u==="RGB"?($=0,w=h,C=h*2):u==="RBG"&&($=0,C=h,w=h*2),a=r.createImageData(n,i);for(let T=0;T<i*n;_+=m,y+=m,b+=m,x+=m,T++)a.data[_]=(e.data[$++]-c[0])*d[0],a.data[y]=(e.data[w++]-c[1])*d[1],a.data[b]=(e.data[C++]-c[2])*d[2],a.data[x]=S===-1?255:(e.data[S++]-c[3])*d[3]}else throw new Error("Can not access image data");return a}}),Dr,Hd,Kd,Zd,Yd,Xd,Cg=q(()=>{en(),Dr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=t,n=t.norm??{mean:255,bias:0},i,s;typeof n.mean=="number"?i=[n.mean,n.mean,n.mean,n.mean]:i=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*a,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),h=4,m=0,_=1,y=2,b=3,x=0,$=d,w=d*2,C=-1;u==="RGB"&&(h=3,m=0,_=1,y=2,b=-1),l==="RGBA"?C=d*3:l==="RBG"?(x=0,w=d,$=d*2):l==="BGR"&&(w=0,$=d,x=d*2);for(let S=0;S<d;S++,m+=h,y+=h,_+=h,b+=h)c[x++]=(e[m]+s[0])/i[0],c[$++]=(e[_]+s[1])/i[1],c[w++]=(e[y]+s[2])/i[2],C!==-1&&b!==-1&&(c[C++]=(e[b]+s[3])/i[3]);return l==="RGBA"?new Le("float32",c,[1,4,r,a]):new Le("float32",c,[1,3,r,a])},Hd=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let m=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(m=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=m,u.width=_}else u.tensorFormat="RGBA",u.height=m,u.width=_;h.drawImage(e,0,0),s=h.getImageData(0,0,_,m).data}else throw new Error("Can not access image data")}else if(a){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=h,t!==void 0){let m=l();m.width=h,m.height=c;let _=d(m);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let m=e.height,_=e.width;return h.drawImage(e,0,0,_,m),s=h.getImageData(0,0,_,m).data,u.height=m,u.width=_,Dr(s,u)}else throw new Error("Can not access image data")}else{if(i)return new Promise((c,h)=>{let m=l(),_=d(m);if(!e||!_)return h();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{m.width=y.width,m.height=y.height,_.drawImage(y,0,0,m.width,m.height);let b=_.getImageData(0,0,m.width,m.height);u.height=m.height,u.width=m.width,c(Dr(b.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Dr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Kd=(e,t)=>{let{width:r,height:a,download:n,dispose:i}=t,s=[1,a,r,4];return new Le({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:i})},Zd=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new Le({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:a,download:n,dispose:i})},Yd=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new Le({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:a,download:n,dispose:i})},Xd=(e,t,r)=>new Le({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Bt,gr,Oi,Qd,Tg=q(()=>{Bt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),gr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Oi=!1,Qd=()=>{if(!Oi){Oi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,a=typeof r<"u"&&r.from;e&&(Bt.set("int64",BigInt64Array),gr.set(BigInt64Array,"int64")),t&&(Bt.set("uint64",BigUint64Array),gr.set(BigUint64Array,"uint64")),a?(Bt.set("float16",r),gr.set(r,"float16")):Bt.set("float16",Uint16Array)}}}),Jd,ep,Sg=q(()=>{en(),Jd=e=>{let t=1;for(let r=0;r<e.length;r++){let a=e[r];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);t*=a}return t},ep=(e,t)=>{switch(e.location){case"cpu":return new Le(e.type,e.data,t);case"cpu-pinned":return new Le({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Le({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Le({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Le({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Le,en=q(()=>{xg(),Cg(),Tg(),Sg(),Le=class{constructor(e,t,r){Qd();let a,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Bt.get(a);if(!s)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(a=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=Bt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")a="string",s=e;else if(l==="boolean")a="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",s=Uint8Array.from(e);else{let l=gr.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");n=u,this.cpuData=s,this.dataLocation="cpu"}let i=Jd(n);if(this.cpuData&&i!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(i/2)===this.cpuData.length))throw new Error(`Tensor's size(${i}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=n,this.size=i}static async fromImage(e,t){return Hd(e,t)}static fromTexture(e,t){return Kd(e,t)}static fromGpuBuffer(e,t){return Zd(e,t)}static fromMLTensor(e,t){return Yd(e,t)}static fromPinnedBuffer(e,t,r){return Xd(e,t,r)}toDataURL(e){return Fd(this,e)}toImageData(e){return Gd(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return ep(this,e)}}}),Qe,tp=q(()=>{en(),Qe=Le}),xr,Ri,Je,je,vt,$t,rp=q(()=>{jd(),xr=(e,t)=>{(typeof Ae.trace>"u"?!Ae.wasm.trace:!Ae.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ri=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],a=!1;for(let i=0;i<r.length;i++){if(a&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),xr("CPU",s);return}r[i].includes("TRACE_FUNC")&&(a=!0)}},Je=e=>{(typeof Ae.trace>"u"?!Ae.wasm.trace:!Ae.trace)||Ri("BEGIN",e)},je=e=>{(typeof Ae.trace>"u"?!Ae.wasm.trace:!Ae.trace)||Ri("END",e)},vt=e=>{(typeof Ae.trace>"u"?!Ae.wasm.trace:!Ae.trace)||console.time(`ORT::${e}`)},$t=e=>{(typeof Ae.trace>"u"?!Ae.wasm.trace:!Ae.trace)||console.timeEnd(`ORT::${e}`)}}),ip,Ig=q(()=>{qd(),tp(),rp(),ip=class ap{constructor(t){this.handler=t}async run(t,r,a){Je(),vt("InferenceSession.run");let n={},i={};if(typeof t!="object"||t===null||t instanceof Qe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Qe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(c.indexOf(h)!==-1){let m=r[h];(m===null||m instanceof Qe)&&(d=!0,s=!1,n[h]=m)}if(d){if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let u=await this.handler.run(t,n,i),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let c=u[d];c instanceof Qe?l[d]=c:l[d]=new Qe(c.type,c.data,c.dims)}return $t("InferenceSession.run"),je(),l}async release(){return this.handler.dispose()}static async create(t,r,a,n){Je(),vt("InferenceSession.create");let i,s={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,m=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(m=t.byteLength-h,typeof a=="number"){if(m=a,!Number.isSafeInteger(m))throw new RangeError("'byteLength' must be an integer.");if(m<=0||h+m>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(c,h,m)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await Ld(s),d=await u.createInferenceSessionHandler(i,l);return $t("InferenceSession.create"),je(),new ap(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),tn,kg=q(()=>{Ig(),tn=ip}),Eg=q(()=>{}),Ag=q(()=>{}),zg=q(()=>{}),Og=q(()=>{}),np={};er(np,{InferenceSession:()=>tn,TRACE:()=>xr,TRACE_EVENT_BEGIN:()=>vt,TRACE_EVENT_END:()=>$t,TRACE_FUNC_BEGIN:()=>Je,TRACE_FUNC_END:()=>je,Tensor:()=>Qe,env:()=>le,registerBackend:()=>Pt});var Fe=q(()=>{wg(),$g(),kg(),tp(),Eg(),Ag(),rp(),zg(),Og()}),rn=q(()=>{}),sp={};er(sp,{default:()=>op});var Bi,Di,op,Rg=q(()=>{var e;fh(),qt(),an(),Bi="ort-wasm-proxy-worker",Di=((e=globalThis.self)==null?void 0:e.name)===Bi,Di&&(self.onmessage=t=>{let{type:r,in:a}=t.data;try{switch(r){case"init-wasm":nn(a.wasm).then(()=>{$n(a).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:i}=a;xn(i,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=a,i=ai(n);postMessage({type:r,out:i});break}case"create":{let{model:n,options:i}=a;Cn(n,i).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":Tn(a),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:i,inputs:s,outputIndices:u,options:l}=a;Sn(n,i,s,u,new Array(u.length).fill(null),l).then(d=>{d.some(c=>c[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},kn([...s,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":In(a),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),op=Di?null:t=>new Worker(t??We,{type:"module",name:Bi})}),up={};er(up,{default:()=>lp});var Mi,lp,Hs,Bg=q(()=>{var e,t;Mi=async function(r={}){var Fs;var a,n,i=r,s=new Promise((o,p)=>{a=o,n=p}),u=typeof window=="object",l=typeof WorkerGlobalScope<"u",d=l&&((Fs=self.name)==null?void 0:Fs.startsWith("em-pthread"));i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Fb||(i.Fb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Fb};var c=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let h=o=>async(...p)=>{var f;try{if(i.Gb)throw Error("Session already started");let g=i.Gb={ec:p[0],errors:[]},v=await o(...p);if(i.Gb!==g)throw Error("Session mismatch");(f=i.Kb)==null||f.flush();let I=g.errors;if(0<I.length){let E=await Promise.all(I);if(E=E.filter(R=>R),0<E.length)throw Error(E.join(`
`))}return v}finally{i.Gb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Kb,i.Vb,i.Zb,i.Lb,i.Yb,i.Ab,i.$b,i.bc,i.Wb,i.Xb,i.ac]=p;let f=i.Kb;i.jsepRegisterBuffer=(g,v,I,E)=>f.registerBuffer(g,v,I,E),i.jsepGetBuffer=g=>f.getBuffer(g),i.jsepCreateDownloader=(g,v,I)=>f.createDownloader(g,v,I),i.jsepOnCreateSession=g=>{f.onCreateSession(g)},i.jsepOnReleaseSession=g=>{f.onReleaseSession(g)},i.jsepOnRunStart=g=>f.onRunStart(g),i.cc=(g,v)=>{f.upload(g,v)}}else if(o==="webnn"){let f=p[0];[i.oc,i.Ob,i.webnnEnsureTensor,i.Pb,i.webnnDownloadTensor,i.nc,i.webnnEnableTraceEvent]=p.slice(1),i.webnnReleaseTensorId=i.Ob,i.webnnUploadTensor=i.Pb,i.webnnRegisterMLContext=i.nc,i.webnnOnRunStart=g=>f.onRunStart(g),i.webnnOnRunEnd=f.onRunEnd.bind(f),i.webnnOnReleaseSession=g=>{f.onReleaseSession(g)},i.webnnCreateMLTensorDownloader=(g,v)=>f.createMLTensorDownloader(g,v),i.webnnRegisterMLTensor=(g,v,I,E)=>f.registerMLTensor(g,v,I,E),i.webnnCreateMLContext=g=>f.createMLContext(g),i.webnnRegisterMLConstant=(g,v,I,E,R,P)=>f.registerMLConstant(g,v,I,E,R,i.Fb,P),i.webnnRegisterGraphInput=f.registerGraphInput.bind(f),i.webnnIsGraphInput=f.isGraphInput.bind(f),i.webnnRegisterGraphOutput=f.registerGraphOutput.bind(f),i.webnnIsGraphOutput=f.isGraphOutput.bind(f),i.webnnCreateTemporaryTensor=f.createTemporaryTensor.bind(f),i.webnnIsGraphInputOutputTypeSupported=f.isGraphInputOutputTypeSupported.bind(f)}};let m=()=>{let o=(p,f,g)=>(...v)=>{let I=rt,E=f==null?void 0:f();v=p(...v);let R=f==null?void 0:f();return E!==R&&(p=R,g(E),f=g=null),rt!=I?new Promise((P,j)=>{wi={resolve:P,reject:j}}):v};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],f=>i[p]=f)})(),h!==void 0&&(i._OrtRun=h(i._OrtRun),i._OrtRunWithBinding=h(i._OrtRunWithBinding)),m=void 0};i.asyncInit=()=>{m==null||m()};var _,y,b=(o,p)=>{throw p},x=import.meta.url,$="";if(u||l){try{$=new URL(".",x).href}catch{}l&&(y=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),_=async o=>{if(G(o))return new Promise((f,g)=>{var v=new XMLHttpRequest;v.open("GET",o,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?f(v.response):g(v.status)},v.onerror=g,v.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var w,C,S,T,k,A,z,O,W,V,F,U,K,ie,Y,se=console.log.bind(console),Z=console.error.bind(console),te=se,_e=Z,N=!1,G=o=>o.startsWith("file://");function H(){return C.buffer!=k.buffer&&ge(),k}function re(){return C.buffer!=k.buffer&&ge(),A}function Ie(){return C.buffer!=k.buffer&&ge(),z}function et(){return C.buffer!=k.buffer&&ge(),O}function L(){return C.buffer!=k.buffer&&ge(),W}function be(){return C.buffer!=k.buffer&&ge(),V}function Ne(){return C.buffer!=k.buffer&&ge(),F}function Re(){return C.buffer!=k.buffer&&ge(),ie}if(d){let o=function(p){try{var f=p.data,g=f.Db;if(g==="load"){let v=[];self.onmessage=I=>v.push(I),self.startWorker=()=>{postMessage({Db:"loaded"});for(let I of v)o(I);self.onmessage=o};for(let I of f.Sb)i[I]&&!i[I].proxy||(i[I]=(...E)=>{postMessage({Db:"callHandler",Rb:I,args:E})},I=="print"&&(te=i[I]),I=="printErr"&&(_e=i[I]));C=f.kc,ge(),Y(f.lc)}else if(g==="run"){Hh(f.Bb),Si(f.Bb,0,0,1,0,0),Ln(),_i(f.Bb),at||(Rs(),at=!0);try{Kh(f.hc,f.Jb)}catch(v){if(v!="unwind")throw v}}else f.target!=="setimmediate"&&(g==="checkMailbox"?at&&Tr():g&&(_e(`worker: received unknown command ${g}`),_e(f)))}catch(v){throw Bs(),v}};var at=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function ge(){var o=C.buffer;i.HEAP8=k=new Int8Array(o),z=new Int16Array(o),i.HEAPU8=A=new Uint8Array(o),O=new Uint16Array(o),i.HEAP32=W=new Int32Array(o),i.HEAPU32=V=new Uint32Array(o),F=new Float32Array(o),ie=new Float64Array(o),U=new BigInt64Array(o),K=new BigUint64Array(o)}function xe(){d?startWorker(i):D.Da()}var Pe,Tt=0,St=null;function Bn(){if(--Tt==0&&St){var o=St;St=null,o()}}function ft(o){throw _e(o="Aborted("+o+")"),N=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),n(o),o}function Dn(){return{a:{L:pg,Aa:dg,b:Yh,$:Fn,A:Kn,pa:Zn,X:Yn,Z:Xn,qa:Qn,na:Jn,ga:es,ma:ts,J:rs,Y:is,V:as,oa:ns,W:ss,va:Xh,E:Qh,Q:Jh,O:tm,D:im,v:am,s:nm,P:sm,z:fm,R:hm,ja:mm,T:gm,aa:ym,M:_m,F:bm,ia:_i,sa:wm,r:vm,Ca:$m,w:Tm,o:Sm,m:km,c:hi,Ba:Em,n:Am,j:Rm,u:Bm,p:Dm,f:Mm,t:Nm,l:Pm,e:Um,k:Wm,h:Lm,g:qm,d:Vm,da:jm,ea:Fm,fa:Gm,ba:bs,ca:ws,N:vs,xa:Km,ua:Ym,i:Xm,C:Qm,G:Jm,ta:Zm,x:eg,ra:tg,U:rg,q:Hm,y:ig,K:ag,S:ng,za:sg,ya:og,ka:Ts,la:Ss,_:di,B:Is,I:ks,ha:Es,H:As,a:C,wa:li}}}class oi{constructor(p){ve(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var Mn=o=>{o.terminate(),o.onmessage=()=>{}},ui=[],Nn=o=>{mt.length==0&&(Vn(),qn(mt[0]));var p=mt.pop();if(!p)return 6;tr.push(p),It[o.Bb]=p,p.Bb=o.Bb;var f={Db:"run",hc:o.fc,Jb:o.Jb,Bb:o.Bb};return p.postMessage(f,o.Nb),0},ht=0,$e=(o,p,...f)=>{for(var g=2*f.length,v=Ei(),I=ki(8*g),E=I>>>3,R=0;R<f.length;R++){var P=f[R];typeof P=="bigint"?(U[E+2*R]=1n,U[E+2*R+1]=P):(U[E+2*R]=0n,Re()[E+2*R+1>>>0]=P)}return o=Ds(o,0,g,I,p),Br(v),o};function li(o){if(d)return $e(0,1,o);if(T=o,!(0<ht)){for(var p of tr)Mn(p);for(p of mt)Mn(p);mt=[],tr=[],It={},N=!0}b(0,new oi(o))}function Pn(o){if(d)return $e(1,0,o);di(o)}var di=o=>{if(T=o,d)throw Pn(o),"unwind";li(o)},mt=[],tr=[],Un=[],It={},Wn=o=>{var p=o.Bb;delete It[p],mt.push(o),tr.splice(tr.indexOf(o),1),o.Bb=0,Ms(p)};function Ln(){Un.forEach(o=>o())}var qn=o=>new Promise(p=>{o.onmessage=v=>{var I=(v=v.data).Db;if(v.Hb&&v.Hb!=Ti()){var E=It[v.Hb];E?E.postMessage(v,v.Nb):_e(`Internal error! Worker sent a message "${I}" to target pthread ${v.Hb}, but that thread no longer exists!`)}else I==="checkMailbox"?Tr():I==="spawnThread"?Nn(v):I==="cleanupThread"?Wn(It[v.ic]):I==="loaded"?(o.loaded=!0,p(o)):v.target==="setimmediate"?o.postMessage(v):I==="callHandler"?i[v.Rb](...v.args):I&&_e(`worker sent an unknown command ${I}`)},o.onerror=v=>{throw _e(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var f,g=[];for(f of[])i.propertyIsEnumerable(f)&&g.push(f);o.postMessage({Db:"load",Sb:g,kc:C,lc:S})});function Vn(){var o=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});mt.push(o)}var Hh=o=>{ge();var p=be()[o+52>>>2>>>0];o=be()[o+56>>>2>>>0],Us(p,p-o),Br(p)},Kh=(o,p)=>{ht=0,o=Ws(o,p),0<ht?T=o:Ii(o)};class Zh{constructor(p){this.Ib=p-24}}function Yh(o,p,f){var g=new Zh(o>>>=0);throw p>>>=0,f>>>=0,be()[g.Ib+16>>>2>>>0]=0,be()[g.Ib+4>>>2>>>0]=p,be()[g.Ib+8>>>2>>>0]=f,o}function jn(o,p,f,g){return d?$e(2,1,o,p,f,g):Fn(o,p,f,g)}function Fn(o,p,f,g){if(o>>>=0,f>>>=0,g>>>=0,c===void 0)return 6;var v=[];return d&&v.length===0?jn(o,p>>>=0,f,g):(o={fc:f,Bb:o,Jb:g,Nb:v},d?(o.Db="spawnThread",postMessage(o,v),0):Nn(o))}var Gn=typeof TextDecoder<"u"?new TextDecoder:void 0,Hn=(o,p=0,f=NaN)=>{var g=(p>>>=0)+f;for(f=p;o[f]&&!(f>=g);)++f;if(16<f-p&&o.buffer&&Gn)return Gn.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,f):o.slice(p,f));for(g="";p<f;){var v=o[p++];if(128&v){var I=63&o[p++];if((224&v)==192)g+=String.fromCharCode((31&v)<<6|I);else{var E=63&o[p++];65536>(v=(240&v)==224?(15&v)<<12|I<<6|E:(7&v)<<18|I<<12|E<<6|63&o[p++])?g+=String.fromCharCode(v):(v-=65536,g+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else g+=String.fromCharCode(v)}return g},Se=(o,p)=>(o>>>=0)?Hn(re(),o,p):"";function Kn(o,p,f){return d?$e(3,1,o,p,f):0}function Zn(o,p){if(d)return $e(4,1,o,p)}function Yn(o,p){if(d)return $e(5,1,o,p)}function Xn(o,p,f){if(d)return $e(6,1,o,p,f)}function Qn(o,p,f){return d?$e(7,1,o,p,f):0}function Jn(o,p){if(d)return $e(8,1,o,p)}function es(o,p,f){if(d)return $e(9,1,o,p,f)}function ts(o,p,f,g){if(d)return $e(10,1,o,p,f,g)}function rs(o,p,f,g){if(d)return $e(11,1,o,p,f,g)}function is(o,p,f,g){if(d)return $e(12,1,o,p,f,g)}function as(o){if(d)return $e(13,1,o)}function ns(o,p){if(d)return $e(14,1,o,p)}function ss(o,p,f){if(d)return $e(15,1,o,p,f)}var os,Xh=()=>ft(""),tt=o=>{for(var p="";re()[o>>>0];)p+=os[re()[o++>>>0]];return p},pi={},ci={},jt=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}};function nt(o,p,f={}){return(function(g,v,I={}){var E=v.name;if(!g)throw new jt(`type "${E}" must have a positive integer typeid pointer`);if(ci.hasOwnProperty(g)){if(I.Tb)return;throw new jt(`Cannot register type '${E}' twice`)}ci[g]=v,pi.hasOwnProperty(g)&&(v=pi[g],delete pi[g],v.forEach(R=>R()))})(o,p,f)}var us=(o,p,f)=>{switch(p){case 1:return f?g=>H()[g>>>0]:g=>re()[g>>>0];case 2:return f?g=>Ie()[g>>>1>>>0]:g=>et()[g>>>1>>>0];case 4:return f?g=>L()[g>>>2>>>0]:g=>be()[g>>>2>>>0];case 8:return f?g=>U[g>>>3]:g=>K[g>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function Qh(o,p,f){f>>>=0,nt(o>>>=0,{name:p=tt(p>>>0),fromWireType:g=>g,toWireType:function(g,v){if(typeof v!="bigint"&&typeof v!="number")throw v=v===null?"null":(g=typeof v)=="object"||g==="array"||g==="function"?v.toString():""+v,new TypeError(`Cannot convert "${v}" to ${this.name}`);return typeof v=="number"&&(v=BigInt(v)),v},Cb:gt,readValueFromPointer:us(p,f,p.indexOf("u")==-1),Eb:null})}var gt=8;function Jh(o,p,f,g){nt(o>>>=0,{name:p=tt(p>>>0),fromWireType:function(v){return!!v},toWireType:function(v,I){return I?f:g},Cb:gt,readValueFromPointer:function(v){return this.fromWireType(re()[v>>>0])},Eb:null})}var fi=[],st=[];function hi(o){9<(o>>>=0)&&--st[o+1]==0&&(st[o]=void 0,fi.push(o))}var Be=o=>{if(!o)throw new jt(`Cannot use deleted val. handle = ${o}`);return st[o]},Ve=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=fi.pop()||st.length;return st[p]=o,st[p+1]=1,p}};function mi(o){return this.fromWireType(be()[o>>>2>>>0])}var em={name:"emscripten::val",fromWireType:o=>{var p=Be(o);return hi(o),p},toWireType:(o,p)=>Ve(p),Cb:gt,readValueFromPointer:mi,Eb:null};function tm(o){return nt(o>>>0,em)}var rm=(o,p)=>{switch(p){case 4:return function(f){return this.fromWireType(Ne()[f>>>2>>>0])};case 8:return function(f){return this.fromWireType(Re()[f>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function im(o,p,f){f>>>=0,nt(o>>>=0,{name:p=tt(p>>>0),fromWireType:g=>g,toWireType:(g,v)=>v,Cb:gt,readValueFromPointer:rm(p,f),Eb:null})}function am(o,p,f,g,v){if(o>>>=0,f>>>=0,p=tt(p>>>0),v===-1&&(v=4294967295),v=R=>R,g===0){var I=32-8*f;v=R=>R<<I>>>I}var E=p.includes("unsigned")?function(R,P){return P>>>0}:function(R,P){return P};nt(o,{name:p,fromWireType:v,toWireType:E,Cb:gt,readValueFromPointer:us(p,f,g!==0),Eb:null})}function nm(o,p,f){function g(I){var E=be()[I>>>2>>>0];return I=be()[I+4>>>2>>>0],new v(H().buffer,I,E)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];nt(o>>>=0,{name:f=tt(f>>>0),fromWireType:g,Cb:gt,readValueFromPointer:g},{Tb:!0})}var kt=(o,p,f)=>{var g=re();if(p>>>=0,0<f){var v=p;f=p+f-1;for(var I=0;I<o.length;++I){var E=o.charCodeAt(I);if(55296<=E&&57343>=E&&(E=65536+((1023&E)<<10)|1023&o.charCodeAt(++I)),127>=E){if(p>=f)break;g[p++>>>0]=E}else{if(2047>=E){if(p+1>=f)break;g[p++>>>0]=192|E>>6}else{if(65535>=E){if(p+2>=f)break;g[p++>>>0]=224|E>>12}else{if(p+3>=f)break;g[p++>>>0]=240|E>>18,g[p++>>>0]=128|E>>12&63}g[p++>>>0]=128|E>>6&63}g[p++>>>0]=128|63&E}}g[p>>>0]=0,o=p-v}else o=0;return o},gi=o=>{for(var p=0,f=0;f<o.length;++f){var g=o.charCodeAt(f);127>=g?p++:2047>=g?p+=2:55296<=g&&57343>=g?(p+=4,++f):p+=3}return p};function sm(o,p){nt(o>>>=0,{name:p=tt(p>>>0),fromWireType:function(f){for(var g,v=be()[f>>>2>>>0],I=f+4,E=I,R=0;R<=v;++R){var P=I+R;R!=v&&re()[P>>>0]!=0||(E=Se(E,P-E),g===void 0?g=E:(g+="\0",g+=E),E=P+1)}return ot(f),g},toWireType:function(f,g){g instanceof ArrayBuffer&&(g=new Uint8Array(g));var v=typeof g=="string";if(!(v||ArrayBuffer.isView(g)&&g.BYTES_PER_ELEMENT==1))throw new jt("Cannot pass non-string to std::string");var I=v?gi(g):g.length,E=Rr(4+I+1),R=E+4;return be()[E>>>2>>>0]=I,v?kt(g,R,I+1):re().set(g,R>>>0),f!==null&&f.push(ot,E),E},Cb:gt,readValueFromPointer:mi,Eb(f){ot(f)}})}var ls=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,om=(o,p)=>{for(var f=o>>1,g=f+p/2;!(f>=g)&&et()[f>>>0];)++f;if(32<(f<<=1)-o&&ls)return ls.decode(re().slice(o,f));for(f="",g=0;!(g>=p/2);++g){var v=Ie()[o+2*g>>>1>>>0];if(v==0)break;f+=String.fromCharCode(v)}return f},um=(o,p,f)=>{if(f??(f=2147483647),2>f)return 0;var g=p;f=(f-=2)<2*o.length?f/2:o.length;for(var v=0;v<f;++v){var I=o.charCodeAt(v);Ie()[p>>>1>>>0]=I,p+=2}return Ie()[p>>>1>>>0]=0,p-g},lm=o=>2*o.length,dm=(o,p)=>{for(var f=0,g="";!(f>=p/4);){var v=L()[o+4*f>>>2>>>0];if(v==0)break;++f,65536<=v?(v-=65536,g+=String.fromCharCode(55296|v>>10,56320|1023&v)):g+=String.fromCharCode(v)}return g},pm=(o,p,f)=>{if(p>>>=0,f??(f=2147483647),4>f)return 0;var g=p;f=g+f-4;for(var v=0;v<o.length;++v){var I=o.charCodeAt(v);if(55296<=I&&57343>=I&&(I=65536+((1023&I)<<10)|1023&o.charCodeAt(++v)),L()[p>>>2>>>0]=I,(p+=4)+4>f)break}return L()[p>>>2>>>0]=0,p-g},cm=o=>{for(var p=0,f=0;f<o.length;++f){var g=o.charCodeAt(f);55296<=g&&57343>=g&&++f,p+=4}return p};function fm(o,p,f){if(o>>>=0,p>>>=0,f=tt(f>>>=0),p===2)var g=om,v=um,I=lm,E=R=>et()[R>>>1>>>0];else p===4&&(g=dm,v=pm,I=cm,E=R=>be()[R>>>2>>>0]);nt(o,{name:f,fromWireType:R=>{for(var P,j=be()[R>>>2>>>0],X=R+4,ae=0;ae<=j;++ae){var de=R+4+ae*p;ae!=j&&E(de)!=0||(X=g(X,de-X),P===void 0?P=X:(P+="\0",P+=X),X=de+p)}return ot(R),P},toWireType:(R,P)=>{if(typeof P!="string")throw new jt(`Cannot pass non-string to C++ string type ${f}`);var j=I(P),X=Rr(4+j+p);return be()[X>>>2>>>0]=j/p,v(P,X+4,j+p),R!==null&&R.push(ot,X),X},Cb:gt,readValueFromPointer:mi,Eb(R){ot(R)}})}function hm(o,p){nt(o>>>=0,{Ub:!0,name:p=tt(p>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function mm(o){Si(o>>>0,!l,1,!u,131072,!1),Ln()}var yi=o=>{if(!N)try{if(o(),!(0<ht))try{d?Ii(T):di(T)}catch(p){p instanceof oi||p=="unwind"||b(0,p)}}catch(p){p instanceof oi||p=="unwind"||b(0,p)}};function _i(o){o>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(L(),o>>>2,o).value.then(Tr),o+=128,Atomics.store(L(),o>>>2,1))}var Tr=()=>{var o=Ti();o&&(_i(o),yi(Ps))};function gm(o,p){(o>>>=0)==p>>>0?setTimeout(Tr):d?postMessage({Hb:o,Db:"checkMailbox"}):(o=It[o])&&o.postMessage({Db:"checkMailbox"})}var bi=[];function ym(o,p,f,g,v){for(p>>>=0,g/=2,bi.length=g,f=v>>>0>>>3,v=0;v<g;v++)bi[v]=U[f+2*v]?U[f+2*v+1]:Re()[f+2*v+1>>>0];return(p?Ci[p]:lg[o])(...bi)}var _m=()=>{ht=0};function bm(o){o>>>=0,d?postMessage({Db:"cleanupThread",ic:o}):Wn(It[o])}function wm(o){}var Sr=(o,p)=>{var f=ci[o];if(f===void 0)throw o=Os(o),f=tt(o),ot(o),new jt(`${p} has unknown type ${f}`);return f},ds=(o,p,f)=>{var g=[];return o=o.toWireType(g,f),g.length&&(be()[p>>>2>>>0]=Ve(g)),o};function vm(o,p,f){return p>>>=0,f>>>=0,o=Be(o>>>0),p=Sr(p,"emval::as"),ds(p,f,o)}function $m(o,p){return p>>>=0,o=Be(o>>>0),(p=Sr(p,"emval::as")).toWireType(null,o)}var Ir=o=>{try{o()}catch(p){ft(p)}},yt=0,rt=null,ps=0,kr=[],cs={},fs={},xm=0,wi=null,Cm=[];function hs(o){return(function(p){if(!N){if(yt===0){var f=!1,g=!1;p((v=0)=>{if(!N&&(ps=v,f=!0,g)){yt=2,Ir(()=>Vs(rt)),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.resume(),v=!1;try{var I=(function(){var P=L()[rt+8>>>2>>>0];return P=D[fs[P]],--ht,P()})()}catch(P){I=P,v=!0}var E=!1;if(!rt){var R=wi;R&&(wi=null,(v?R.reject:R.resolve)(I),E=!0)}if(v&&!E)throw I}}),g=!0,f||(yt=1,rt=(function(){var v=Rr(65548),I=v+12;be()[v>>>2>>>0]=I,be()[v+4>>>2>>>0]=I+65536,I=kr[0];var E=cs[I];return E===void 0&&(E=xm++,cs[I]=E,fs[E]=I),I=E,L()[v+8>>>2>>>0]=I,v})(),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.pause(),Ir(()=>Ls(rt)))}else yt===2?(yt=0,Ir(js),ot(rt),rt=null,Cm.forEach(yi)):ft(`invalid state: ${yt}`);return ps}})(p=>{o().then(p)})}function Tm(o){return o>>>=0,hs(async()=>{var p=await Be(o);return Ve(p)})}var Er=[];function Sm(o,p,f,g){return f>>>=0,g>>>=0,(o=Er[o>>>0])(null,p=Be(p>>>0),f,g)}var Im={},Ar=o=>{var p=Im[o];return p===void 0?tt(o):p};function km(o,p,f,g,v){return f>>>=0,g>>>=0,v>>>=0,(o=Er[o>>>0])(p=Be(p>>>0),p[f=Ar(f)],g,v)}function Em(o,p){return p>>>=0,(o=Be(o>>>0))==Be(p)}var ms=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Am(o){return(o>>>=0)==0?Ve(ms()):(o=Ar(o),Ve(ms()[o]))}var zm=o=>{var p=Er.length;return Er.push(o),p},Om=(o,p)=>{for(var f=Array(o),g=0;g<o;++g)f[g]=Sr(be()[p+4*g>>>2>>>0],`parameter ${g}`);return f};function Rm(o,p,f){var g=(p=Om(o,p>>>0)).shift();o--;var v=`return function (obj, func, destructorsRef, args) {
`,I=0,E=[];f===0&&E.push("obj");for(var R=["retType"],P=[g],j=0;j<o;++j)E.push(`arg${j}`),R.push(`argType${j}`),P.push(p[j]),v+=`  var arg${j} = argType${j}.readValueFromPointer(args${I?"+"+I:""});
`,I+=p[j].Cb;return v+=`  var rv = ${f===1?"new func":"func.call"}(${E.join(", ")});
`,g.Ub||(R.push("emval_returnValue"),P.push(ds),v+=`  return emval_returnValue(retType, destructorsRef, rv);
`),o=new Function(...R,v+`};
`)(...P),f=`methodCaller<(${p.map(X=>X.name).join(", ")}) => ${g.name}>`,zm(Object.defineProperty(o,"name",{value:f}))}function Bm(o){return o=Ar(o>>>0),Ve(i[o])}function Dm(o,p){return p>>>=0,o=Be(o>>>0),p=Be(p),Ve(o[p])}function Mm(o){9<(o>>>=0)&&(st[o+1]+=1)}function Nm(){return Ve([])}function Pm(o){o=Be(o>>>0);for(var p=Array(o.length),f=0;f<o.length;f++)p[f]=o[f];return Ve(p)}function Um(o){return Ve(Ar(o>>>0))}function Wm(){return Ve({})}function Lm(o){for(var p=Be(o>>>=0);p.length;){var f=p.pop();p.pop()(f)}hi(o)}function qm(o,p,f){p>>>=0,f>>>=0,o=Be(o>>>0),p=Be(p),f=Be(f),o[p]=f}function Vm(o,p){return p>>>=0,o=(o=Sr(o>>>0,"_emval_take_value")).readValueFromPointer(p),Ve(o)}function jm(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),L()[p>>>2>>>0]=o.getUTCSeconds(),L()[p+4>>>2>>>0]=o.getUTCMinutes(),L()[p+8>>>2>>>0]=o.getUTCHours(),L()[p+12>>>2>>>0]=o.getUTCDate(),L()[p+16>>>2>>>0]=o.getUTCMonth(),L()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,L()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,L()[p+28>>>2>>>0]=o}var gs=o=>o%4==0&&(o%100!=0||o%400==0),ys=[0,31,60,91,121,152,182,213,244,274,305,335],_s=[0,31,59,90,120,151,181,212,243,273,304,334];function Fm(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),L()[p>>>2>>>0]=o.getSeconds(),L()[p+4>>>2>>>0]=o.getMinutes(),L()[p+8>>>2>>>0]=o.getHours(),L()[p+12>>>2>>>0]=o.getDate(),L()[p+16>>>2>>>0]=o.getMonth(),L()[p+20>>>2>>>0]=o.getFullYear()-1900,L()[p+24>>>2>>>0]=o.getDay();var f=(gs(o.getFullYear())?ys:_s)[o.getMonth()]+o.getDate()-1|0;L()[p+28>>>2>>>0]=f,L()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),f=new Date(o.getFullYear(),6,1).getTimezoneOffset();var g=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(f!=g&&o.getTimezoneOffset()==Math.min(g,f)),L()[p+32>>>2>>>0]=o}function Gm(o){o>>>=0;var p=new Date(L()[o+20>>>2>>>0]+1900,L()[o+16>>>2>>>0],L()[o+12>>>2>>>0],L()[o+8>>>2>>>0],L()[o+4>>>2>>>0],L()[o>>>2>>>0],0),f=L()[o+32>>>2>>>0],g=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),I=new Date(p.getFullYear(),0,1).getTimezoneOffset(),E=Math.min(I,v);return 0>f?L()[o+32>>>2>>>0]=+(v!=I&&E==g):0<f!=(E==g)&&(v=Math.max(I,v),p.setTime(p.getTime()+6e4*((0<f?E:v)-g))),L()[o+24>>>2>>>0]=p.getDay(),f=(gs(p.getFullYear())?ys:_s)[p.getMonth()]+p.getDate()-1|0,L()[o+28>>>2>>>0]=f,L()[o>>>2>>>0]=p.getSeconds(),L()[o+4>>>2>>>0]=p.getMinutes(),L()[o+8>>>2>>>0]=p.getHours(),L()[o+12>>>2>>>0]=p.getDate(),L()[o+16>>>2>>>0]=p.getMonth(),L()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function bs(o,p,f,g,v,I,E){return d?$e(16,1,o,p,f,g,v,I,E):-52}function ws(o,p,f,g,v,I){if(d)return $e(17,1,o,p,f,g,v,I)}var rr={},Hm=()=>performance.timeOrigin+performance.now();function vs(o,p){if(d)return $e(18,1,o,p);if(rr[o]&&(clearTimeout(rr[o].id),delete rr[o]),!p)return 0;var f=setTimeout(()=>{delete rr[o],yi(()=>Ns(o,performance.timeOrigin+performance.now()))},p);return rr[o]={id:f,rc:p},0}function Km(o,p,f,g){o>>>=0,p>>>=0,f>>>=0,g>>>=0;var v=new Date().getFullYear(),I=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var E=Math.max(I,v);be()[o>>>2>>>0]=60*E,L()[p>>>2>>>0]=+(I!=v),o=(p=R=>{var P=Math.abs(R);return`UTC${0<=R?"-":"+"}${String(Math.floor(P/60)).padStart(2,"0")}${String(P%60).padStart(2,"0")}`})(I),p=p(v),v<I?(kt(o,f,17),kt(p,g,17)):(kt(o,g,17),kt(p,f,17))}var Zm=()=>Date.now();function Ym(o,p,f){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),U[f>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var vi=[],$s=(o,p)=>{vi.length=0;for(var f;f=re()[o++>>>0];){var g=f!=105;p+=(g&=f!=112)&&p%8?4:0,vi.push(f==112?be()[p>>>2>>>0]:f==106?U[p>>>3]:f==105?L()[p>>>2>>>0]:Re()[p>>>3>>>0]),p+=g?8:4}return vi};function Xm(o,p,f){return o>>>=0,p=$s(p>>>0,f>>>0),Ci[o](...p)}function Qm(o,p,f){return o>>>=0,p=$s(p>>>0,f>>>0),Ci[o](...p)}var Jm=()=>{};function eg(o,p){return _e(Se(o>>>0,p>>>0))}var tg=()=>{throw ht+=1,"unwind"};function rg(){return 4294901760}var ig=()=>navigator.hardwareConcurrency;function ag(){return ft("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function ng(o){o>>>=0;var p=re().length;if(o<=p||4294901760<o)return!1;for(var f=1;4>=f;f*=2){var g=p*(1+.2/f);g=Math.min(g,o+100663296);e:{g=(Math.min(4294901760,65536*Math.ceil(Math.max(o,g)/65536))-C.buffer.byteLength+65535)/65536|0;try{C.grow(g),ge();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}var zr=()=>(ft("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),ir={},xs=o=>{o.forEach(p=>{zr()})};function sg(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),xs(o),ir.Mb=zr(),ir.dc=o,ir.Mb}function og(o,p,f){if(o>>>=0,p>>>=0,ir.Mb==o)var g=ir.dc;else(g=Error().stack.toString().split(`
`))[0]=="Error"&&g.shift(),xs(g);for(var v=3;g[v]&&zr()!=o;)++v;for(o=0;o<f&&g[o+v];++o)L()[p+4*o>>>2>>>0]=zr();return o}var $i,xi={},Cs=()=>{if(!$i){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in xi)xi[o]===void 0?delete p[o]:p[o]=xi[o];var f=[];for(o in p)f.push(`${o}=${p[o]}`);$i=f}return $i};function Ts(o,p){if(d)return $e(19,1,o,p);o>>>=0,p>>>=0;var f,g=0,v=0;for(f of Cs()){var I=p+g;be()[o+v>>>2>>>0]=I,g+=kt(f,I,1/0)+1,v+=4}return 0}function Ss(o,p){if(d)return $e(20,1,o,p);o>>>=0,p>>>=0;var f=Cs();for(var g of(be()[o>>>2>>>0]=f.length,o=0,f))o+=gi(g)+1;return be()[p>>>2>>>0]=o,0}function Is(o){return d?$e(21,1,o):52}function ks(o,p,f,g){return d?$e(22,1,o,p,f,g):52}function Es(o,p,f,g){return d?$e(23,1,o,p,f,g):70}var ug=[null,[],[]];function As(o,p,f,g){if(d)return $e(24,1,o,p,f,g);p>>>=0,f>>>=0,g>>>=0;for(var v=0,I=0;I<f;I++){var E=be()[p>>>2>>>0],R=be()[p+4>>>2>>>0];p+=8;for(var P=0;P<R;P++){var j=o,X=re()[E+P>>>0],ae=ug[j];X===0||X===10?((j===1?te:_e)(Hn(ae)),ae.length=0):ae.push(X)}v+=R}return be()[g>>>2>>>0]=v,0}d||(function(){for(var o=i.numThreads-1;o--;)Vn();ui.push(()=>{Tt++,(function(p){d?p():Promise.all(mt.map(qn)).then(p)})(()=>Bn())})})();for(var zs=Array(256),Or=0;256>Or;++Or)zs[Or]=String.fromCharCode(Or);os=zs,st.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>st.length/2-5-fi.length,d||(C=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),ge()),i.wasmBinary&&(w=i.wasmBinary),i.stackSave=()=>Ei(),i.stackRestore=o=>Br(o),i.stackAlloc=o=>ki(o),i.setValue=function(o,p,f="i8"){switch(f.endsWith("*")&&(f="*"),f){case"i1":case"i8":H()[o>>>0]=p;break;case"i16":Ie()[o>>>1>>>0]=p;break;case"i32":L()[o>>>2>>>0]=p;break;case"i64":U[o>>>3]=BigInt(p);break;case"float":Ne()[o>>>2>>>0]=p;break;case"double":Re()[o>>>3>>>0]=p;break;case"*":be()[o>>>2>>>0]=p;break;default:ft(`invalid type for setValue: ${f}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return H()[o>>>0];case"i16":return Ie()[o>>>1>>>0];case"i32":return L()[o>>>2>>>0];case"i64":return U[o>>>3];case"float":return Ne()[o>>>2>>>0];case"double":return Re()[o>>>3>>>0];case"*":return be()[o>>>2>>>0];default:ft(`invalid type for getValue: ${p}`)}},i.UTF8ToString=Se,i.stringToUTF8=kt,i.lengthBytesUTF8=gi;var lg=[li,Pn,jn,Kn,Zn,Yn,Xn,Qn,Jn,es,ts,rs,is,as,ns,ss,bs,ws,vs,Ts,Ss,Is,ks,Es,As],Ci={893836:(o,p,f,g,v)=>{if(i===void 0||!i.Fb)return 1;if((o=Se(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Fb.get(o)))return 2;if(p=Number(p>>>0),f=Number(f>>>0),g=Number(g>>>0),p+f>o.byteLength)return 3;try{let I=o.subarray(p,p+f);switch(v){case 0:re().set(I,g>>>0);break;case 1:i.mc?i.mc(g,I):i.cc(g,I);break;default:return 4}return 0}catch{return 4}},894660:(o,p,f)=>{i.Pb(o,re().subarray(p>>>0,p+f>>>0))},894724:()=>i.oc(),894766:o=>{i.Ob(o)},894803:()=>{i.Wb()},894834:()=>{i.Xb()},894863:()=>{i.ac()},894888:o=>i.Vb(o),894921:o=>i.Zb(o),894953:(o,p,f)=>{i.Lb(Number(o),Number(p),Number(f),!0)},895016:(o,p,f)=>{i.Lb(Number(o),Number(p),Number(f))},895073:()=>typeof wasmOffsetConverter<"u",895130:o=>{i.Ab("Abs",o,void 0)},895181:o=>{i.Ab("Neg",o,void 0)},895232:o=>{i.Ab("Floor",o,void 0)},895285:o=>{i.Ab("Ceil",o,void 0)},895337:o=>{i.Ab("Reciprocal",o,void 0)},895395:o=>{i.Ab("Sqrt",o,void 0)},895447:o=>{i.Ab("Exp",o,void 0)},895498:o=>{i.Ab("Erf",o,void 0)},895549:o=>{i.Ab("Sigmoid",o,void 0)},895604:(o,p,f)=>{i.Ab("HardSigmoid",o,{alpha:p,beta:f})},895683:o=>{i.Ab("Log",o,void 0)},895734:o=>{i.Ab("Sin",o,void 0)},895785:o=>{i.Ab("Cos",o,void 0)},895836:o=>{i.Ab("Tan",o,void 0)},895887:o=>{i.Ab("Asin",o,void 0)},895939:o=>{i.Ab("Acos",o,void 0)},895991:o=>{i.Ab("Atan",o,void 0)},896043:o=>{i.Ab("Sinh",o,void 0)},896095:o=>{i.Ab("Cosh",o,void 0)},896147:o=>{i.Ab("Asinh",o,void 0)},896200:o=>{i.Ab("Acosh",o,void 0)},896253:o=>{i.Ab("Atanh",o,void 0)},896306:o=>{i.Ab("Tanh",o,void 0)},896358:o=>{i.Ab("Not",o,void 0)},896409:(o,p,f)=>{i.Ab("Clip",o,{min:p,max:f})},896478:o=>{i.Ab("Clip",o,void 0)},896530:(o,p)=>{i.Ab("Elu",o,{alpha:p})},896588:o=>{i.Ab("Gelu",o,void 0)},896640:o=>{i.Ab("Relu",o,void 0)},896692:(o,p)=>{i.Ab("LeakyRelu",o,{alpha:p})},896756:(o,p)=>{i.Ab("ThresholdedRelu",o,{alpha:p})},896826:(o,p)=>{i.Ab("Cast",o,{to:p})},896884:o=>{i.Ab("Add",o,void 0)},896935:o=>{i.Ab("Sub",o,void 0)},896986:o=>{i.Ab("Mul",o,void 0)},897037:o=>{i.Ab("Div",o,void 0)},897088:o=>{i.Ab("Pow",o,void 0)},897139:o=>{i.Ab("Equal",o,void 0)},897192:o=>{i.Ab("Greater",o,void 0)},897247:o=>{i.Ab("GreaterOrEqual",o,void 0)},897309:o=>{i.Ab("Less",o,void 0)},897361:o=>{i.Ab("LessOrEqual",o,void 0)},897420:(o,p,f,g,v)=>{i.Ab("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},897595:(o,p,f,g,v)=>{i.Ab("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},897769:(o,p,f,g,v)=>{i.Ab("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},897943:(o,p,f,g,v)=>{i.Ab("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898118:(o,p,f,g,v)=>{i.Ab("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898292:(o,p,f,g,v)=>{i.Ab("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898465:(o,p,f,g,v)=>{i.Ab("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898638:(o,p,f,g,v)=>{i.Ab("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898815:(o,p,f,g,v)=>{i.Ab("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},898995:(o,p,f,g,v)=>{i.Ab("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!f,axes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},899175:o=>{i.Ab("Where",o,void 0)},899228:(o,p,f)=>{i.Ab("Transpose",o,{perm:p?Array.from(L().subarray(Number(p)>>>0,Number(f)>>>0)):[]})},899352:(o,p,f,g)=>{i.Ab("DepthToSpace",o,{blocksize:p,mode:Se(f),format:g?"NHWC":"NCHW"})},899485:(o,p,f,g)=>{i.Ab("DepthToSpace",o,{blocksize:p,mode:Se(f),format:g?"NHWC":"NCHW"})},899618:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke)=>{i.Ab("ConvTranspose",o,{format:P?"NHWC":"NCHW",autoPad:p,dilations:[f],group:g,kernelShape:[v],pads:[I,E],strides:[R],wIsConst:()=>!!H()[j>>>0],outputPadding:X?Array.from(L().subarray(Number(X)>>>0,Number(ae)>>>0)):[],outputShape:de?Array.from(L().subarray(Number(de)>>>0,Number(he)>>>0)):[],activation:Se(ke)})},900051:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:p,dilations:Array.from(L().subarray(Number(f)>>>0,2+(Number(f)>>>0)>>>0)),group:g,kernelShape:Array.from(L().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(L().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(L().subarray(Number(E)>>>0,2+(Number(E)>>>0)>>>0)),wIsConst:()=>!!H()[P>>>0],outputPadding:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],outputShape:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[],activation:Se(he)})},900712:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke)=>{i.Ab("ConvTranspose",o,{format:P?"NHWC":"NCHW",autoPad:p,dilations:[f],group:g,kernelShape:[v],pads:[I,E],strides:[R],wIsConst:()=>!!H()[j>>>0],outputPadding:X?Array.from(L().subarray(Number(X)>>>0,Number(ae)>>>0)):[],outputShape:de?Array.from(L().subarray(Number(de)>>>0,Number(he)>>>0)):[],activation:Se(ke)})},901145:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("ConvTranspose",o,{format:R?"NHWC":"NCHW",autoPad:p,dilations:Array.from(L().subarray(Number(f)>>>0,2+(Number(f)>>>0)>>>0)),group:g,kernelShape:Array.from(L().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(L().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(L().subarray(Number(E)>>>0,2+(Number(E)>>>0)>>>0)),wIsConst:()=>!!H()[P>>>0],outputPadding:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],outputShape:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[],activation:Se(he)})},901806:(o,p)=>{i.Ab("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},901897:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("AveragePool",o,{format:he?"NHWC":"NCHW",auto_pad:p,ceil_mode:f,count_include_pad:g,storage_order:v,dilations:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[],kernel_shape:R?Array.from(L().subarray(Number(R)>>>0,Number(P)>>>0)):[],pads:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],strides:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[]})},902376:(o,p)=>{i.Ab("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},902467:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("AveragePool",o,{format:he?"NHWC":"NCHW",auto_pad:p,ceil_mode:f,count_include_pad:g,storage_order:v,dilations:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[],kernel_shape:R?Array.from(L().subarray(Number(R)>>>0,Number(P)>>>0)):[],pads:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],strides:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[]})},902946:(o,p)=>{i.Ab("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},903033:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("MaxPool",o,{format:he?"NHWC":"NCHW",auto_pad:p,ceil_mode:f,count_include_pad:g,storage_order:v,dilations:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[],kernel_shape:R?Array.from(L().subarray(Number(R)>>>0,Number(P)>>>0)):[],pads:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],strides:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[]})},903508:(o,p)=>{i.Ab("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},903595:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>{i.Ab("MaxPool",o,{format:he?"NHWC":"NCHW",auto_pad:p,ceil_mode:f,count_include_pad:g,storage_order:v,dilations:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[],kernel_shape:R?Array.from(L().subarray(Number(R)>>>0,Number(P)>>>0)):[],pads:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],strides:ae?Array.from(L().subarray(Number(ae)>>>0,Number(de)>>>0)):[]})},904070:(o,p,f,g,v)=>{i.Ab("Gemm",o,{alpha:p,beta:f,transA:g,transB:v})},904174:o=>{i.Ab("MatMul",o,void 0)},904228:(o,p,f,g)=>{i.Ab("ArgMax",o,{keepDims:!!p,selectLastIndex:!!f,axis:g})},904336:(o,p,f,g)=>{i.Ab("ArgMin",o,{keepDims:!!p,selectLastIndex:!!f,axis:g})},904444:(o,p)=>{i.Ab("Softmax",o,{axis:p})},904507:(o,p)=>{i.Ab("Concat",o,{axis:p})},904567:(o,p,f,g,v)=>{i.Ab("Split",o,{axis:p,numOutputs:f,splitSizes:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},904723:o=>{i.Ab("Expand",o,void 0)},904777:(o,p)=>{i.Ab("Gather",o,{axis:Number(p)})},904848:(o,p)=>{i.Ab("GatherElements",o,{axis:Number(p)})},904927:(o,p)=>{i.Ab("GatherND",o,{batch_dims:Number(p)})},905006:(o,p,f,g,v,I,E,R,P,j,X)=>{i.Ab("Resize",o,{antialias:p,axes:f?Array.from(L().subarray(Number(f)>>>0,Number(g)>>>0)):[],coordinateTransformMode:Se(v),cubicCoeffA:I,excludeOutside:E,extrapolationValue:R,keepAspectRatioPolicy:Se(P),mode:Se(j),nearestMode:Se(X)})},905368:(o,p,f,g,v,I,E)=>{i.Ab("Slice",o,{starts:p?Array.from(L().subarray(Number(p)>>>0,Number(f)>>>0)):[],ends:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[],axes:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[]})},905632:o=>{i.Ab("Tile",o,void 0)},905684:(o,p,f)=>{i.Ab("InstanceNormalization",o,{epsilon:p,format:f?"NHWC":"NCHW"})},905798:(o,p,f)=>{i.Ab("InstanceNormalization",o,{epsilon:p,format:f?"NHWC":"NCHW"})},905912:o=>{i.Ab("Range",o,void 0)},905965:(o,p)=>{i.Ab("Einsum",o,{equation:Se(p)})},906046:(o,p,f,g,v)=>{i.Ab("Pad",o,{mode:p,value:f,pads:g?Array.from(L().subarray(Number(g)>>>0,Number(v)>>>0)):[]})},906189:(o,p,f,g,v,I)=>{i.Ab("BatchNormalization",o,{epsilon:p,momentum:f,spatial:!!v,trainingMode:!!g,format:I?"NHWC":"NCHW"})},906358:(o,p,f,g,v,I)=>{i.Ab("BatchNormalization",o,{epsilon:p,momentum:f,spatial:!!v,trainingMode:!!g,format:I?"NHWC":"NCHW"})},906527:(o,p,f)=>{i.Ab("CumSum",o,{exclusive:Number(p),reverse:Number(f)})},906624:(o,p,f)=>{i.Ab("DequantizeLinear",o,{axis:p,blockSize:f})},906714:(o,p,f,g,v)=>{i.Ab("GridSample",o,{align_corners:p,mode:Se(f),padding_mode:Se(g),format:v?"NHWC":"NCHW"})},906884:(o,p,f,g,v)=>{i.Ab("GridSample",o,{align_corners:p,mode:Se(f),padding_mode:Se(g),format:v?"NHWC":"NCHW"})},907054:(o,p)=>{i.Ab("ScatterND",o,{reduction:Se(p)})},907139:(o,p,f,g,v,I,E,R,P)=>{i.Ab("Attention",o,{numHeads:p,isUnidirectional:f,maskFilterValue:g,scale:v,doRotary:I,qkvHiddenSizes:E?Array.from(L().subarray(Number(R)>>>0,Number(R)+E>>>0)):[],pastPresentShareBuffer:!!P})},907411:o=>{i.Ab("BiasAdd",o,void 0)},907466:o=>{i.Ab("BiasSplitGelu",o,void 0)},907527:o=>{i.Ab("FastGelu",o,void 0)},907583:(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue)=>{i.Ab("Conv",o,{format:ae?"NHWC":"NCHW",auto_pad:p,dilations:f?Array.from(L().subarray(Number(f)>>>0,Number(g)>>>0)):[],group:v,kernel_shape:I?Array.from(L().subarray(Number(I)>>>0,Number(E)>>>0)):[],pads:R?Array.from(L().subarray(Number(R)>>>0,Number(P)>>>0)):[],strides:j?Array.from(L().subarray(Number(j)>>>0,Number(X)>>>0)):[],w_is_const:()=>!!H()[Number(de)>>>0],activation:Se(he),activation_params:ke?Array.from(Ne().subarray(Number(ke)>>>0,Number(Ue)>>>0)):[]})},908167:o=>{i.Ab("Gelu",o,void 0)},908219:(o,p,f,g,v,I,E,R,P)=>{i.Ab("GroupQueryAttention",o,{numHeads:p,kvNumHeads:f,scale:g,softcap:v,doRotary:I,rotaryInterleaved:E,smoothSoftmax:R,localWindowSize:P})},908436:(o,p,f,g)=>{i.Ab("LayerNormalization",o,{axis:p,epsilon:f,simplified:!!g})},908547:(o,p,f,g)=>{i.Ab("LayerNormalization",o,{axis:p,epsilon:f,simplified:!!g})},908658:(o,p,f,g,v,I)=>{i.Ab("MatMulNBits",o,{k:p,n:f,accuracyLevel:g,bits:v,blockSize:I})},908785:(o,p,f,g,v,I)=>{i.Ab("MultiHeadAttention",o,{numHeads:p,isUnidirectional:f,maskFilterValue:g,scale:v,doRotary:I})},908944:(o,p)=>{i.Ab("QuickGelu",o,{alpha:p})},909008:(o,p,f,g,v)=>{i.Ab("RotaryEmbedding",o,{interleaved:!!p,numHeads:f,rotaryEmbeddingDim:g,scale:v})},909147:(o,p,f)=>{i.Ab("SkipLayerNormalization",o,{epsilon:p,simplified:!!f})},909249:(o,p,f)=>{i.Ab("SkipLayerNormalization",o,{epsilon:p,simplified:!!f})},909351:(o,p,f,g)=>{i.Ab("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:f,blockSize:g})},909472:o=>{i.$b(o)},909506:(o,p)=>i.bc(Number(o),Number(p),i.Gb.ec,i.Gb.errors)};function dg(o,p,f){return hs(async()=>{await i.Yb(Number(o),Number(p),Number(f))})}function pg(){return typeof wasmOffsetConverter<"u"}var D=await(async function(){function o(g,v){return D=g.exports,D=(function(){var I=D,E={};for(let[R,P]of Object.entries(I))E[R]=typeof P=="function"?(...j)=>{kr.push(R);try{return P(...j)}finally{N||(kr.pop(),rt&&yt===1&&kr.length===0&&(yt=0,ht+=1,Ir(qs),typeof Fibers<"u"&&Fibers.sc()))}}:P;return E})(),D=(function(){var I=D,E=P=>j=>P(j)>>>0,R=P=>()=>P()>>>0;return(I=Object.assign({},I)).Ea=E(I.Ea),I.gb=R(I.gb),I.ib=E(I.ib),I.tb=E(I.tb),I.ub=R(I.ub),I.__cxa_get_exception_ptr=E(I.__cxa_get_exception_ptr),I})(),Un.push(D.jb),S=v,Bn(),D}Tt++;var p=Dn();if(i.instantiateWasm)return new Promise(g=>{i.instantiateWasm(p,(v,I)=>{g(o(v,I))})});if(d)return new Promise(g=>{Y=v=>{var I=new WebAssembly.Instance(v,Dn());g(o(I,v))}});Pe??(Pe=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",$):$+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep-BGTZ4Y7F.wasm",import.meta.url).href);try{var f=await(async function(g){var v=Pe;if(!w&&typeof WebAssembly.instantiateStreaming=="function"&&!G(v))try{var I=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(I,g)}catch(E){_e(`wasm streaming compile failed: ${E}`),_e("falling back to ArrayBuffer instantiation")}return(async function(E,R){try{var P=await(async function(j){if(!w)try{var X=await _(j);return new Uint8Array(X)}catch{}if(j==Pe&&w)j=new Uint8Array(w);else{if(!y)throw"both async and sync fetching of the wasm failed";j=y(j)}return j})(E);return await WebAssembly.instantiate(P,R)}catch(j){_e(`failed to asynchronously prepare wasm: ${j}`),ft(j)}})(v,g)})(p);return o(f.instance,f.module)}catch(g){return n(g),Promise.reject(g)}})(),Os=o=>(Os=D.Ea)(o),Rs=()=>(Rs=D.Fa)();i._OrtInit=(o,p)=>(i._OrtInit=D.Ga)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=D.Ha)(o,p),i._OrtCreateSessionOptions=(o,p,f,g,v,I,E,R,P,j)=>(i._OrtCreateSessionOptions=D.Ia)(o,p,f,g,v,I,E,R,P,j),i._OrtAppendExecutionProvider=(o,p,f,g,v)=>(i._OrtAppendExecutionProvider=D.Ja)(o,p,f,g,v),i._OrtAddFreeDimensionOverride=(o,p,f)=>(i._OrtAddFreeDimensionOverride=D.Ka)(o,p,f),i._OrtAddSessionConfigEntry=(o,p,f)=>(i._OrtAddSessionConfigEntry=D.La)(o,p,f),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=D.Ma)(o),i._OrtCreateSession=(o,p,f)=>(i._OrtCreateSession=D.Na)(o,p,f),i._OrtReleaseSession=o=>(i._OrtReleaseSession=D.Oa)(o),i._OrtGetInputOutputCount=(o,p,f)=>(i._OrtGetInputOutputCount=D.Pa)(o,p,f),i._OrtGetInputOutputMetadata=(o,p,f,g)=>(i._OrtGetInputOutputMetadata=D.Qa)(o,p,f,g),i._OrtFree=o=>(i._OrtFree=D.Ra)(o),i._OrtCreateTensor=(o,p,f,g,v,I)=>(i._OrtCreateTensor=D.Sa)(o,p,f,g,v,I),i._OrtGetTensorData=(o,p,f,g,v)=>(i._OrtGetTensorData=D.Ta)(o,p,f,g,v),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=D.Ua)(o),i._OrtCreateRunOptions=(o,p,f,g)=>(i._OrtCreateRunOptions=D.Va)(o,p,f,g),i._OrtAddRunConfigEntry=(o,p,f)=>(i._OrtAddRunConfigEntry=D.Wa)(o,p,f),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=D.Xa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=D.Ya)(o),i._OrtBindInput=(o,p,f)=>(i._OrtBindInput=D.Za)(o,p,f),i._OrtBindOutput=(o,p,f,g)=>(i._OrtBindOutput=D._a)(o,p,f,g),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=D.$a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=D.ab)(o),i._OrtRunWithBinding=(o,p,f,g,v)=>(i._OrtRunWithBinding=D.bb)(o,p,f,g,v),i._OrtRun=(o,p,f,g,v,I,E,R)=>(i._OrtRun=D.cb)(o,p,f,g,v,I,E,R),i._OrtEndProfiling=o=>(i._OrtEndProfiling=D.db)(o),i._JsepOutput=(o,p,f)=>(i._JsepOutput=D.eb)(o,p,f),i._JsepGetNodeName=o=>(i._JsepGetNodeName=D.fb)(o);var Ti=()=>(Ti=D.gb)(),ot=i._free=o=>(ot=i._free=D.hb)(o),Rr=i._malloc=o=>(Rr=i._malloc=D.ib)(o),Si=(o,p,f,g,v,I)=>(Si=D.kb)(o,p,f,g,v,I),Bs=()=>(Bs=D.lb)(),Ds=(o,p,f,g,v)=>(Ds=D.mb)(o,p,f,g,v),Ms=o=>(Ms=D.nb)(o),Ii=o=>(Ii=D.ob)(o),Ns=(o,p)=>(Ns=D.pb)(o,p),Ps=()=>(Ps=D.qb)(),Us=(o,p)=>(Us=D.rb)(o,p),Br=o=>(Br=D.sb)(o),ki=o=>(ki=D.tb)(o),Ei=()=>(Ei=D.ub)(),Ws=i.dynCall_ii=(o,p)=>(Ws=i.dynCall_ii=D.vb)(o,p);i.dynCall_vii=(o,p,f)=>(i.dynCall_vii=D.dynCall_vii)(o,p,f),i.dynCall_iiiii=(o,p,f,g,v)=>(i.dynCall_iiiii=D.dynCall_iiiii)(o,p,f,g,v),i.dynCall_iii=(o,p,f)=>(i.dynCall_iii=D.dynCall_iii)(o,p,f),i.dynCall_iiiiii=(o,p,f,g,v,I)=>(i.dynCall_iiiiii=D.dynCall_iiiiii)(o,p,f,g,v,I),i.dynCall_iiiiiiii=(o,p,f,g,v,I,E,R)=>(i.dynCall_iiiiiiii=D.dynCall_iiiiiiii)(o,p,f,g,v,I,E,R),i.dynCall_iiiiiii=(o,p,f,g,v,I,E)=>(i.dynCall_iiiiiii=D.dynCall_iiiiiii)(o,p,f,g,v,I,E),i.dynCall_vi=(o,p)=>(i.dynCall_vi=D.dynCall_vi)(o,p),i.dynCall_iiii=(o,p,f,g)=>(i.dynCall_iiii=D.dynCall_iiii)(o,p,f,g),i.dynCall_i=o=>(i.dynCall_i=D.dynCall_i)(o),i.dynCall_viiiiiiii=(o,p,f,g,v,I,E,R,P)=>(i.dynCall_viiiiiiii=D.dynCall_viiiiiiii)(o,p,f,g,v,I,E,R,P),i.dynCall_viii=(o,p,f,g)=>(i.dynCall_viii=D.dynCall_viii)(o,p,f,g),i.dynCall_viijj=(o,p,f,g,v)=>(i.dynCall_viijj=D.dynCall_viijj)(o,p,f,g,v),i.dynCall_viiiiii=(o,p,f,g,v,I,E)=>(i.dynCall_viiiiii=D.dynCall_viiiiii)(o,p,f,g,v,I,E),i.dynCall_viiii=(o,p,f,g,v)=>(i.dynCall_viiii=D.dynCall_viiii)(o,p,f,g,v),i.dynCall_viiiii=(o,p,f,g,v,I)=>(i.dynCall_viiiii=D.dynCall_viiiii)(o,p,f,g,v,I),i.dynCall_vfiii=(o,p,f,g,v)=>(i.dynCall_vfiii=D.dynCall_vfiii)(o,p,f,g,v),i.dynCall_viiiiff=(o,p,f,g,v,I,E)=>(i.dynCall_viiiiff=D.dynCall_viiiiff)(o,p,f,g,v,I,E),i.dynCall_viiiiiff=(o,p,f,g,v,I,E,R)=>(i.dynCall_viiiiiff=D.dynCall_viiiiiff)(o,p,f,g,v,I,E,R),i.dynCall_ffff=(o,p,f,g)=>(i.dynCall_ffff=D.dynCall_ffff)(o,p,f,g),i.dynCall_viiff=(o,p,f,g,v)=>(i.dynCall_viiff=D.dynCall_viiff)(o,p,f,g,v),i.dynCall_fffffff=(o,p,f,g,v,I,E)=>(i.dynCall_fffffff=D.dynCall_fffffff)(o,p,f,g,v,I,E),i.dynCall_jjjjjjj=(o,p,f,g,v,I,E)=>(i.dynCall_jjjjjjj=D.dynCall_jjjjjjj)(o,p,f,g,v,I,E),i.dynCall_jjjjjj=(o,p,f,g,v,I)=>(i.dynCall_jjjjjj=D.dynCall_jjjjjj)(o,p,f,g,v,I),i.dynCall_iijjii=(o,p,f,g,v,I)=>(i.dynCall_iijjii=D.dynCall_iijjii)(o,p,f,g,v,I),i.dynCall_viiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he)=>(i.dynCall_viiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he),i.dynCall_viiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X)=>(i.dynCall_viiiiiiiiii=D.dynCall_viiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X),i.dynCall_viiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae)=>(i.dynCall_viiiiiiiiiii=D.dynCall_viiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae),i.dynCall_viiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de)=>(i.dynCall_viiiiiiiiiiii=D.dynCall_viiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de),i.dynCall_viiiiiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar)=>(i.dynCall_viiiiiiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar),i.dynCall_viiiiiiiii=(o,p,f,g,v,I,E,R,P,j)=>(i.dynCall_viiiiiiiii=D.dynCall_viiiiiiiii)(o,p,f,g,v,I,E,R,P,j),i.dynCall_viiiiiiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar,Ai)=>(i.dynCall_viiiiiiiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar,Ai),i.dynCall_viiiiiii=(o,p,f,g,v,I,E,R)=>(i.dynCall_viiiiiii=D.dynCall_viiiiiii)(o,p,f,g,v,I,E,R),i.dynCall_viiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue)=>(i.dynCall_viiiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue),i.dynCall_jiji=(o,p,f,g)=>(i.dynCall_jiji=D.dynCall_jiji)(o,p,f,g),i.dynCall_v=o=>(i.dynCall_v=D.dynCall_v)(o),i.dynCall_iidiiii=(o,p,f,g,v,I,E)=>(i.dynCall_iidiiii=D.dynCall_iidiiii)(o,p,f,g,v,I,E),i.dynCall_iiiiiiiii=(o,p,f,g,v,I,E,R,P)=>(i.dynCall_iiiiiiiii=D.dynCall_iiiiiiiii)(o,p,f,g,v,I,E,R,P),i.dynCall_iiij=(o,p,f,g)=>(i.dynCall_iiij=D.dynCall_iiij)(o,p,f,g),i.dynCall_iiiiiiiiii=(o,p,f,g,v,I,E,R,P,j)=>(i.dynCall_iiiiiiiiii=D.dynCall_iiiiiiiiii)(o,p,f,g,v,I,E,R,P,j),i.dynCall_iiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de)=>(i.dynCall_iiiiiiiiiiiii=D.dynCall_iiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de),i.dynCall_iiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X)=>(i.dynCall_iiiiiiiiiii=D.dynCall_iiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X),i.dynCall_ji=(o,p)=>(i.dynCall_ji=D.dynCall_ji)(o,p),i.dynCall_iijii=(o,p,f,g,v)=>(i.dynCall_iijii=D.dynCall_iijii)(o,p,f,g,v),i.dynCall_vij=(o,p,f)=>(i.dynCall_vij=D.dynCall_vij)(o,p,f),i.dynCall_viiijii=(o,p,f,g,v,I,E)=>(i.dynCall_viiijii=D.dynCall_viiijii)(o,p,f,g,v,I,E),i.dynCall_viijiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et)=>(i.dynCall_viijiiiiiiiiiiiiii=D.dynCall_viijiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et),i.dynCall_viiiji=(o,p,f,g,v,I)=>(i.dynCall_viiiji=D.dynCall_viiiji)(o,p,f,g,v,I),i.dynCall_fiii=(o,p,f,g)=>(i.dynCall_fiii=D.dynCall_fiii)(o,p,f,g),i.dynCall_viijii=(o,p,f,g,v,I)=>(i.dynCall_viijii=D.dynCall_viijii)(o,p,f,g,v,I),i.dynCall_viij=(o,p,f,g)=>(i.dynCall_viij=D.dynCall_viij)(o,p,f,g),i.dynCall_jiij=(o,p,f,g)=>(i.dynCall_jiij=D.dynCall_jiij)(o,p,f,g),i.dynCall_fi=(o,p)=>(i.dynCall_fi=D.dynCall_fi)(o,p),i.dynCall_fii=(o,p,f)=>(i.dynCall_fii=D.dynCall_fii)(o,p,f),i.dynCall_jii=(o,p,f)=>(i.dynCall_jii=D.dynCall_jii)(o,p,f),i.dynCall_dii=(o,p,f)=>(i.dynCall_dii=D.dynCall_dii)(o,p,f),i.dynCall_fiiii=(o,p,f,g,v)=>(i.dynCall_fiiii=D.dynCall_fiiii)(o,p,f,g,v),i.dynCall_fif=(o,p,f)=>(i.dynCall_fif=D.dynCall_fif)(o,p,f),i.dynCall_jfi=(o,p,f)=>(i.dynCall_jfi=D.dynCall_jfi)(o,p,f),i.dynCall_viiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke)=>(i.dynCall_viiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke),i.dynCall_viiiiiiiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar,Ai,cg)=>(i.dynCall_viiiiiiiiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut,Et,ar,Ai,cg),i.dynCall_viiiiiiiiiiiiiiii=(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut)=>(i.dynCall_viiiiiiiiiiiiiiii=D.dynCall_viiiiiiiiiiiiiiii)(o,p,f,g,v,I,E,R,P,j,X,ae,de,he,ke,Ue,ut),i.dynCall_iif=(o,p,f)=>(i.dynCall_iif=D.dynCall_iif)(o,p,f),i.dynCall_jiiii=(o,p,f,g,v)=>(i.dynCall_jiiii=D.dynCall_jiiii)(o,p,f,g,v),i.dynCall_jiii=(o,p,f,g)=>(i.dynCall_jiii=D.dynCall_jiii)(o,p,f,g),i.dynCall_viif=(o,p,f,g)=>(i.dynCall_viif=D.dynCall_viif)(o,p,f,g),i.dynCall_viiij=(o,p,f,g,v)=>(i.dynCall_viiij=D.dynCall_viiij)(o,p,f,g,v),i.dynCall_viiiijii=(o,p,f,g,v,I,E,R)=>(i.dynCall_viiiijii=D.dynCall_viiiijii)(o,p,f,g,v,I,E,R),i.dynCall_iiiiij=(o,p,f,g,v,I)=>(i.dynCall_iiiiij=D.dynCall_iiiiij)(o,p,f,g,v,I),i.dynCall_iiiiid=(o,p,f,g,v,I)=>(i.dynCall_iiiiid=D.dynCall_iiiiid)(o,p,f,g,v,I),i.dynCall_iiiiijj=(o,p,f,g,v,I,E)=>(i.dynCall_iiiiijj=D.dynCall_iiiiijj)(o,p,f,g,v,I,E),i.dynCall_iiiiiijj=(o,p,f,g,v,I,E,R)=>(i.dynCall_iiiiiijj=D.dynCall_iiiiiijj)(o,p,f,g,v,I,E,R);var Ls=o=>(Ls=D.wb)(o),qs=()=>(qs=D.xb)(),Vs=o=>(Vs=D.yb)(o),js=()=>(js=D.zb)();return(function o(){if(0<Tt)St=o;else if(d)a(i),xe();else{for(;0<ui.length;)ui.shift()(i);0<Tt?St=o:(i.calledRun=!0,N||(xe(),a(i)))}})(),i.PTR_SIZE=4,s},lp=Mi,Hs=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Hs&&Mi()}),Ni,Aa,Ks,We,dp,Mr,Zs,Ys,Pi,Xs,Ui,pp,Wi,cp,an=q(()=>{rn(),Ni=typeof location>"u"?void 0:location.origin,Aa=import.meta.url>"file:"&&import.meta.url<"file;",Ks=()=>{{if(Aa){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Ni).href}return import.meta.url}},We=Ks(),dp=()=>{if(We&&!We.startsWith("blob:"))return We.substring(0,We.lastIndexOf("/")+1)},Mr=(e,t)=>{try{let r=t??We;return(r?new URL(e,r):new URL(e)).origin===Ni}catch{return!1}},Zs=(e,t)=>{let r=t??We;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Ys=(e,t)=>`${t??"./"}${e}`,Pi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Xs=async e=>(await import(e)).default,Ui=(Rg(),$r(sp)).default,pp=async()=>{if(!We)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Mr(We))return[void 0,Ui()];let e=await Pi(We);return[e,Ui(e)]},Wi=(Bg(),$r(up)).default,cp=async(e,t,r,a)=>{let n=Wi&&!(e||t);if(n)if(We)n=Mr(We);else if(a&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Wi];{let i="ort-wasm-simd-threaded.jsep.mjs",s=e??Zs(i,t),u=r&&s&&!Mr(s,t),l=u?await Pi(s):s??Ys(i,t);return[u?l:void 0,await Xs(l)]}}}),Li,Nr,sr,qi,Qs,Js,eo,nn,we,qt=q(()=>{an(),Nr=!1,sr=!1,qi=!1,Qs=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Js=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},eo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},nn=async e=>{if(Nr)return Promise.resolve();if(sr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(qi)throw new Error("previous call to 'initializeWebAssembly()' failed.");sr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!eo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Js())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let a=Qs();r>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,i=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,u=(s==null?void 0:s.href)??s,l=n==null?void 0:n.wasm,d=(l==null?void 0:l.href)??l,c=e.wasmBinary,[h,m]=await cp(u,i,r>1,!!c||!!d),_=!1,y=[];if(t>0&&y.push(new Promise(b=>{setTimeout(()=>{_=!0,b()},t)})),y.push(new Promise((b,x)=>{let $={numThreads:r};if(c)$.wasmBinary=c;else if(d||i)$.locateFile=w=>d??i+w;else if(u&&u.indexOf("blob:")!==0)$.locateFile=w=>new URL(w,u).href;else if(h){let w=dp();w&&($.locateFile=C=>w+C)}m($).then(w=>{sr=!1,Nr=!0,Li=w,b(),h&&URL.revokeObjectURL(h)},w=>{sr=!1,qi=!0,x(w)})})),await Promise.race(y),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},we=()=>{if(Nr&&Li)return Li;throw new Error("WebAssembly is not initialized yet.")}}),Xe,Qr,ye,sn=q(()=>{qt(),Xe=(e,t)=>{let r=we(),a=r.lengthBytesUTF8(e)+1,n=r._malloc(a);return r.stringToUTF8(e,n,a),t.push(n),n},Qr=(e,t,r,a)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,i])=>{let s=t?t+n:n;if(typeof i=="object")Qr(i,s+".",r,a);else if(typeof i=="string"||typeof i=="number")a(s,i.toString());else if(typeof i=="boolean")a(s,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},ye=e=>{let t=we(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetLastError(n,n+a);let i=Number(t.getValue(n,a===4?"i32":"i64")),s=t.getValue(n+a,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),fp,Dg=q(()=>{qt(),sn(),fp=e=>{let t=we(),r=0,a=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let i=0;return(e==null?void 0:e.tag)!==void 0&&(i=Xe(e.tag,a)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,i),r===0&&ye("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Qr(e.extra,"",new WeakSet,(s,u)=>{let l=Xe(s,a),d=Xe(u,a);t._OrtAddRunConfigEntry(r,l,d)!==0&&ye(`Can't set a run config entry: ${s} - ${u}.`)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),a.forEach(s=>t._free(s)),i}}}),to,ro,io,or,ao,hp,Mg=q(()=>{qt(),sn(),to=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},ro=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},io=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},or=(e,t,r,a)=>{let n=Xe(t,a),i=Xe(r,a);we()._OrtAddSessionConfigEntry(e,n,i)!==0&&ye(`Can't set a session config entry: ${t} - ${r}.`)},ao=async(e,t,r)=>{for(let a of t){let n=typeof a=="string"?a:a.name,i=[];switch(n){case"webnn":if(n="WEBNN",typeof a!="string"){let c=a==null?void 0:a.deviceType;c&&or(e,"deviceType",c,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let c=a;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);or(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let s=Xe(n,r),u=i.length,l=0,d=0;if(u>0){l=we()._malloc(u*we().PTR_SIZE),r.push(l),d=we()._malloc(u*we().PTR_SIZE),r.push(d);for(let c=0;c<u;c++)we().setValue(l+c*we().PTR_SIZE,i[c][0],"*"),we().setValue(d+c*we().PTR_SIZE,i[c][1],"*")}await we()._OrtAppendExecutionProvider(e,s,l,d,u)!==0&&ye(`Can't append execution provider: ${n}.`)}},hp=async e=>{let t=we(),r=0,a=[],n=e||{};io(n);try{let i=to(n.graphOptimizationLevel??"all"),s=ro(n.executionMode??"sequential"),u=typeof n.logId=="string"?Xe(n.logId,a):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof n.optimizedModelFilePath=="string"?Xe(n.optimizedModelFilePath,a):0;if(r=t._OrtCreateSessionOptions(i,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,u,l,d,c),r===0&&ye("Can't create session options."),n.executionProviders&&await ao(r,n.executionProviders,a),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);or(r,"enableGraphCapture",n.enableGraphCapture.toString(),a)}if(n.freeDimensionOverrides)for(let[h,m]of Object.entries(n.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof m!="number"||!Number.isInteger(m)||m<0)throw new Error(`free dimension override value must be a non-negative integer: ${m}`);let _=Xe(h,a);t._OrtAddFreeDimensionOverride(r,_,m)!==0&&ye(`Can't set a free dimension override: ${h} - ${m}.`)}return n.extra!==void 0&&Qr(n.extra,"",new WeakSet,(h,m)=>{or(r,h,m,a)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&ye("Can't release session options."),a.forEach(s=>t._free(s)),i}}}),Dt,pt,Mt,si,Jr,on,un,za,ne=q(()=>{Dt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},pt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Mt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((n,i)=>n*i,1);return r>0?Math.ceil(a*r):void 0},si=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Jr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},on=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",un=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",za=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),ln,mp=q(()=>{rn(),ln=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(a)}catch(u){if(u instanceof RangeError){let l=Math.ceil(a/65536);i=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await n.read();if(u)break;let d=l.byteLength;new Uint8Array(i,s,d).set(l),s+=d}return new Uint8Array(i,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),no,so,oo,uo,dn,lo,ce,ct=q(()=>{ne(),no=["V","I","W","E","F"],so=(e,t)=>{console.log(`[${no[e]},${new Date().toISOString()}]${t}`)},dn=(e,t)=>{oo=e,uo=t},lo=(e,t)=>{let r=Jr(e),a=Jr(oo);r>=a&&so(r,typeof t=="function"?t():t)},ce=(...e)=>{uo&&lo(...e)}}),po,Qt,B,ei,gp,yp,_p,oe=q(()=>{po=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Qt=class{static calcShape(e,t,r=!1){let a=e.length,n=t.length;if(a===0)return t;if(n===0)return e;let i=Math.max(e.length,t.length),s=new Array(i);if(r){if(a<2||n<2)return;let u=po.calcMatMulShape([e[a-2],e[a-1]],[t[n-2],t[n-1]]);if(u===void 0)return;[s[i-2],s[i-1]]=u}for(let u=r?3:1;u<=i;u++){let l=a-u<0?1:e[a-u],d=n-u<0?1:t[n-u];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[i-u]=Math.max(l,d);else{if(c>1)return;s[i-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,a=t.length;if(r>a)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[a-n])return!1;return!0}},B=class Yr{static size(t){return Yr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let a=t.length;if(a===0)return[];let n=new Array(a),i=a-1;for(;i>=0;){if(t[i]%r===0){n[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");n[i]=1,r/=t[i],i--}for(i--;i>=0;i--)n[i]=t[i];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Yr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Yr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,a){let n=1;for(let i=r;i<a;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[i])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let a=new Array(r);a[r-1]=1,a[r-2]=t[r-1];for(let n=r-3;n>=0;--n)a[n]=a[n+1]*t[n+1];return a}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(a=>this.normalizeAxis(a,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(a=>t[a]):t.slice().reverse()}static padShape(t,r){let a=t.length;return t.map((n,i)=>n+r[i]+r[i+a])}static areEqual(t,r){return t.length!==r.length?!1:t.every((a,n)=>a===r[n])}},ei=class yr{static adjustPoolAttributes(t,r,a,n,i,s){if(!t&&a.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=a.length?a.push(r[u+2]):a[u]=r[u+2];for(let u=0;u<a.length;u++)if(u<n.length){if(n[u]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let u=0;u<a.length;u++)if(u<i.length){if(i[u]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let u=0;u<a.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<a.length;u++){if(a[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=a[u]||s[u+a.length]>=a[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,a,n,i,s,u){if(u){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)yr.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],a[l],n[l],i,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,a,n,i,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return yr.computeShapeHelper(t,r,l,a,n,i,s,u),l}static computeConvOutputShape(t,r,a,n,i,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return yr.computeShapeHelper(!1,t,l,a,n,i,s,u),l}static computeShapeHelper(t,r,a,n,i,s,u,l){if(t)for(let d=0;d<r.length-2;d++)a.push(1);else for(let d=0;d<r.length-2;d++)a.push(yr.adjustPadAndReturnShape(r[d+2],n[d],i[d],s[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,a,n,i,s,u,l){let d=a*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return i[s]=0,i[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+n-t;return i[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),i[u]=c-i[s],Math.floor((t+c-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[s]+i[u]-d)/r+1)}},gp=class{static getShapeOfGemmResult(e,t,r,a,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let i,s,u;t?(i=e[1],s=e[0]):(i=e[0],s=e[1]);let l=-1;if(a?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(i<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(n&&!Qt.isValidBroadcast(n,[i,u]))throw new Error("gemm: invalid bias shape for broadcast");return[i,u,s]}},yp=-34028234663852886e22,_p=34028234663852886e22}),pn,bp=q(()=>{ne(),pn=(e,t)=>new(si(t))(e)}),Vi,Oa,ji,co,Fi,fo,Gi,Hi,Ki,ho,wp,Ng=q(()=>{ne(),ct(),Vi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Oa=(e,t)=>{if(t==="int32")return e;let r=Vi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let a=r/8;if(e.byteLength%a!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${a}.`);let n=e.byteLength/a,i=new(si(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let u=0;u<n;u++){let l=i[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&i.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(i,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},ji=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,a=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(a,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(a.some(i=>i<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(a,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(a.some(i=>i<-128||i>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(a,Number);return new Uint8Array(n.buffer)}case"uint8":{if(a.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(a,Number)}case"uint32":{if(a.some(i=>i<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(a,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},co=1,Fi=()=>co++,fo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Gi=(e,t)=>{let r=Vi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((a,n)=>a*n)*r/8):0},Hi=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:a,dataType:n,shape:i,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=a,this.dataType=n,this.tensorShape=i,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Gi(this.dataType,this.tensorShape)}destroy(){ce("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=ji(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((a,n)=>a===r[n])}setIsDataConverted(e){this.isDataConverted=e}},Ki=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,a){let n=this.tensorManager.getMLContext(e),i;if(!n.opSupportLimits().input.dataTypes.includes(t)){if(i=fo.get(t),!i||!n.opSupportLimits().input.dataTypes.includes(i))throw new Error(`WebNN backend does not support data type: ${t}`);ce("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${i}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==Gi(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0,i),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Oa(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ce("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let a=(t=this.wrapper)!=null&&t.isDataConverted?ji(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(a):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(a);return}else return a.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},ho=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Fi();return this.tensorTrackersById.set(e,new Ki(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,a,n){ce("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${a}, copyOld: ${n}}`);let i=this.tensorTrackersById.get(t);if(!i)throw new Error("Tensor not found.");return i.ensureTensor(e,r,a,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ce("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,a){let n=this.getMLContext(e),i=Fi(),s=new Hi({sessionId:e,context:n,tensor:t,dataType:r,shape:a});return this.tensorTrackersById.set(i,new Ki(this,s)),this.externalTensors.add(s),i}async getCachedTensor(e,t,r,a,n,i,s){let u=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){ce("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(d,1)[0];return h.sessionId=e,h}ce("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:a,writable:n,readable:i});return new Hi({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},wp=(...e)=>new ho(...e)}),ur,mo,vp,Pg=q(()=>{ne(),qt(),bp(),Ng(),ct(),ur=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),mo=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),a=Object.keys(t).sort();return r.length===a.length&&r.every((n,i)=>n===a[i]&&e[n]===t[n])},vp=class{constructor(e){this.tensorManager=wp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,dn(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ce("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ce("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ce("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let r=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(r=>mo(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(n=>n.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ce("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,a,n){let i=ur.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,i,a,n)}async createTemporaryTensor(e,t,r){ce("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let a=ur.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,a,r,!1);let i=this.temporarySessionTensorIds.get(e);return i?i.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!we().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ce("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return pn(r,t)}}registerMLTensor(e,t,r,a){let n=ur.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let i=this.tensorManager.registerTensor(e,t,n,a);return ce("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${a}} -> {tensorId: ${i}}`),i}registerMLConstant(e,t,r,a,n,i,s=!1){if(!i)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=i.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(n.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":if(s){let h=Oa(new Uint8Array(d),"int64");c=new Int32Array(h.buffer),n.dataType="int32"}else c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return ce("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),a.constant(n,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let a=this.mlContextBySessionId.get(e),n=ur.get(Dt(t));return typeof n>"u"?!1:r?!!(a!=null&&a.opSupportLimits().input.dataTypes.includes(n)):!!(a!=null&&a.opSupportLimits().output.dataTypes.includes(n))}flush(){}}}),cn=q(()=>{}),Zi,Pr,Ur,go,yo,Yi,Ra,_o,$p,Ug=q(()=>{ct(),cn(),Zi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Pr=[],Ur=e=>Math.ceil(Number(e)/16)*16,go=e=>{for(let t=0;t<Pr.length;t++){let r=Pr[t];if(e<=r)return r}return Math.ceil(e/16)*16},yo=1,Yi=()=>yo++,Ra=async(e,t,r,a)=>{let n=Ur(r),i=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,i,0,n),e.flush(),await i.mapAsync(GPUMapMode.READ);let u=i.getMappedRange();if(a){let l=a();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{i.destroy()}},_o=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Zi)Pr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,a=t.byteOffset,n=t.byteLength,i=Ur(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:i,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,a,n)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,i),this.backend.device.queue.submit([d.finish()]),u.destroy(),ce("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Ur(r.originalSize),i=this.backend.getCommandEncoder();this.backend.endComputePass(),i.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let a;if(r){if(a=r[0],e===r[1])return ce("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=Yi();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),ce("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ce("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=go(e),a,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,i=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||i){let u=(n?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?a=u.pop():a=this.backend.device.createBuffer({size:r,usage:t}):a=this.backend.device.createBuffer({size:r,usage:t})}else a=this.backend.device.createBuffer({size:r,usage:t});let s={id:Yi(),type:0,buffer:a};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ce("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ce("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Ra(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Zi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ce("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},$p=(...e)=>new _o(...e)}),bo,me,Te=q(()=>{bo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},me=e=>new bo(e)}),Jt,Wr,Ee,Oe,ee,Ce,Ba,Xt,xt,J,lr,M,Q,xp,fn,wo,Cp,ue=q(()=>{ne(),oe(),Jt=64,Wr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ee=(e,t=1)=>{let r=Wr(e,t);return typeof r=="string"?r:r[0]},Oe=(e,t=1)=>{let r=Wr(e,t);return typeof r=="string"?r:r[1]},ee=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:B.computeStrides(r)})}),t},Ce=e=>e%4===0?4:e%2===0?2:1,Ba=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Xt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,xt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,J=(e,t,r,a)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,lr=(e,t,r,a,n)=>{let i=typeof r=="number",s=i?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Wr(t,n),c=typeof d=="string"?d:d[1],h=typeof d=="string"?d:d[0],m={indices:l,value:c,storage:h,tensor:t},_=N=>typeof N=="string"?N:`${N}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=i?"uniforms.":"",x=`${b}${e}_shape`,$=`${b}${e}_strides`,w="";for(let N=0;N<s-1;N++)w+=`
    let dim${N} = current / ${J($,N,s)};
    let rest${N} = current % ${J($,N,s)};
    indices[${N}] = dim${N};
    current = rest${N};
    `;w+=`indices[${s-1}] = current;`;let C=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${m.indices} {
    var indices: ${m.indices};
    var current = offset;
    ${w}
    return indices;
  }`,S=N=>(y.offsetToIndices=!0,s<2?N:`o2i_${e}(${N})`),T=[];if(s>=2)for(let N=s-1;N>=0;N--)T.push(`${J($,N,s)} * (indices[${N}])`);let k=s<2?"":`
  fn i2o_${e}(indices: ${m.indices}) -> u32 {
    return ${T.join("+")};
  }`,A=N=>(y.indicesToOffset=!0,s<2?N:`i2o_${e}(${N})`),z=(...N)=>s===0?"0u":`${m.indices}(${N.map(_).join(",")})`,O=(N,G)=>s<2?`${N}`:`${J(N,G,s)}`,W=(N,G,H)=>s<2?`${N}=${H};`:`${J(N,G,s)}=${H};`,V={},F=(N,G)=>{y.broadcastedIndicesToOffset=!0;let H=`${G.name}broadcastedIndicesTo${e}Offset`;if(H in V)return`${H}(${N})`;let re=[];for(let Ie=s-1;Ie>=0;Ie--){let et=G.indicesGet("outputIndices",Ie+G.rank-s);re.push(`${O($,Ie)} * (${et} % ${O(x,Ie)})`)}return V[H]=`fn ${H}(outputIndices: ${G.type.indices}) -> u32 {
             return ${re.length>0?re.join("+"):"0u"};
           }`,`${H}(${N})`},U=(N,G)=>(()=>{if(m.storage===m.value)return`${e}[${N}]=${G};`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`${e}[${N}]=vec2<u32>(u32(${G}), select(0u, 0xFFFFFFFFu, ${G} < 0));`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`${e}[${N}]=vec2<u32>(u32(${G}), 0u);`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`${e}[${N}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${G}));`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),K=N=>(()=>{if(m.storage===m.value)return`${e}[${N}]`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`i32(${e}[${N}].x)`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`u32(${e}[${N}].x)`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${N}] & 0xFFu), bool(${e}[${N}] & 0xFF00u), bool(${e}[${N}] & 0xFF0000u), bool(${e}[${N}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),ie=s<2?"":`
  fn get_${e}ByIndices(indices: ${m.indices}) -> ${c} {
    return ${K(`i2o_${e}(indices)`)};
  }`,Y=s<2?"":(()=>{let N=u.map(H=>`d${H}: u32`).join(", "),G=u.map(H=>`d${H}`).join(", ");return`
  fn get_${e}(${N}) -> ${c} {
    return get_${e}ByIndices(${z(G)});
  }`})(),se=(...N)=>{if(N.length!==s)throw new Error(`indices length must be ${s}`);let G=N.map(_).join(",");return s===0?K("0u"):s===1?K(G[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${G})`)},Z=N=>s<2?K(N):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${N})`),te=s<2?"":`
  fn set_${e}ByIndices(indices: ${m.indices}, value: ${c}) {
    ${U(`i2o_${e}(indices)`,"value")}
  }`,_e=s<2?"":(()=>{let N=u.map(H=>`d${H}: u32`).join(", "),G=u.map(H=>`d${H}`).join(", ");return`
  fn set_${e}(${N}, value: ${c}) {
    set_${e}ByIndices(${z(G)}, value);
  }`})();return{impl:()=>{let N=[],G=!1;return y.offsetToIndices&&(N.push(C),G=!0),y.indicesToOffset&&(N.push(k),G=!0),y.broadcastedIndicesToOffset&&(Object.values(V).forEach(H=>N.push(H)),G=!0),y.set&&(N.push(_e),G=!0),y.setByIndices&&(N.push(te),G=!0),y.get&&(N.push(Y),G=!0),y.getByIndices&&(N.push(ie),G=!0),!i&&G&&N.unshift(`const ${x} = ${m.indices}(${r.join(",")});`,`const ${$} = ${m.indices}(${B.computeStrides(r).join(",")});`),N.join(`
`)},type:m,offsetToIndices:S,indicesToOffset:A,broadcastedIndicesToOffset:F,indices:z,indicesGet:O,indicesSet:W,set:(...N)=>{if(N.length!==s+1)throw new Error(`indices length must be ${s}`);let G=N[s];if(typeof G!="string")throw new Error("value must be string");let H=N.slice(0,s).map(_).join(",");return s===0?U("0u",G):s===1?U(H[0],G):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${H}, ${G})`)},setByOffset:U,setByIndices:(N,G)=>s<2?U(N,G):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${N}, ${G});`),get:se,getByOffset:K,getByIndices:Z,usage:a,name:e,strides:$,shape:x,rank:s}},M=(e,t,r,a=1)=>lr(e,t,r,"input",a),Q=(e,t,r,a=1)=>lr(e,t,r,"output",a),xp=(e,t,r)=>lr(e,t,r,"atomicOutput",1),fn=(e,t,r,a=1)=>lr(e,t,r,"internal",a),wo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Jt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,i=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${a})
  fn main(${i}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:a}of this.uniforms)if(a&&a>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(a/4)}>`);else{let n=a==null||a===1?r:`vec${a}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Cp=(e,t)=>new wo(e,t)}),vo,Xi,$o,xo,Co,To,qe,Tp,Sp,Ct=q(()=>{ne(),oe(),Te(),ue(),vo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Xi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),$o=(e,t)=>B.sortBasedOnPerm(e,Xi(e.length,t)),xo=(e,t,r,a)=>{let n=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let i=0;i<t;++i)n+=`a[${e[i]}]=i[${i}];`;return n+="return a;}"},Co=(e,t)=>{let r=[],a=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&a.push(t[n]);return{newShape:r,newPerm:a}},To=(e,t)=>{let r=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<r)return!1;r=e[a]}return!0},qe=(e,t)=>{let r=e.dataType,a=e.dims.length,n=Xi(a,t),i=$o(e.dims,n),s=e.dims,u=i,l=a<2||To(n,e.dims),d;if(l)return d=y=>{let b=M("input",r,s,4),x=Q("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables(b,x)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=B.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:d};let{newShape:c,newPerm:h}=Co(e.dims,n),m=B.areEqual(h,[2,3,1]),_=B.areEqual(h,[3,1,2]);if(c.length===2||m||_){s=m?[c[0],c[1]*c[2]]:_?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let y=16;return d=b=>{let x=M("a",r,s.length),$=Q("output",r,u.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${y+1}>, ${y}>;
  ${b.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=B.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:b},...ee(s,u)]}},getShaderSource:d}}return d=y=>{let b=M("a",r,s.length),x=Q("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(b,x)}

  ${xo(n,a,b,x)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=B.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...ee(s,u)]}},getShaderSource:d}},Tp=(e,t)=>{vo(e.inputs,t.perm),e.compute(qe(e.inputs[0],t.perm))},Sp=e=>me({perm:e.perm})}),So,Io,ko,Eo,Ao,zo,Oo,Ro,Bo,Do,Ge,Ip,kp,Ep,Ap,zp,Op,Rp,Bp,Dp,Mp,Wg=q(()=>{ne(),oe(),ue(),hn(),Ct(),So={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Io={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},ko={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Eo={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Ao=(e,t)=>{let r=[];for(let a=t-e;a<t;++a)r.push(a);return r},zo=(e,t)=>{let r=[],a=e.length;for(let i=0;i<a;i++)t.indexOf(i)===-1&&r.push(e[i]);let n=t.map(i=>e[i]);return[r,n]},Oo=(e,t)=>{let r=e.length+t.length,a=[],n=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?a.push(e[n++]):a.push(1);return a},Ro=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Bo=(e,t)=>{let r=[];if(!Ro(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&r.push(a);e.forEach(a=>r.push(a))}return r},Do=(e,t,r,a,n,i,s)=>{let u=r[0].dims,l=B.size(i),d=B.size(s),c=M("_A",r[0].dataType,u),h=Q("output",n,i),m=64;l===1&&(m=256);let _=`
          var<workgroup> aBestValues : array<f32, ${m}>;
       `,y=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(c,h)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(m)}

          let outputIndex = global_idx / ${m};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${ko[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${m}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${So[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${m}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Io[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${a==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${Eo[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${m}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Ge=(e,t,r,a)=>{let n=e.inputs.length===1?r:Da(e.inputs,r),i=n.axes;i.length===0&&!n.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((_,y)=>y));let s=B.normalizeAxes(i,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=Bo(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(qe(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=Ao(u.length,l.dims.length));let[c,h]=zo(l.dims,u),m=c;n.keepDims&&(m=Oo(c,s)),e.compute(Do(t,n.cacheKey,[l],a,e.inputs[0].dataType,m,h),{inputs:[l]})},Ip=(e,t)=>{Ge(e,"ReduceMeanShared",t,"mean")},kp=(e,t)=>{Ge(e,"ReduceL1Shared",t,"l1")},Ep=(e,t)=>{Ge(e,"ReduceL2Shared",t,"l2")},Ap=(e,t)=>{Ge(e,"ReduceLogSumExpShared",t,"logSumExp")},zp=(e,t)=>{Ge(e,"ReduceMaxShared",t,"max")},Op=(e,t)=>{Ge(e,"ReduceMinShared",t,"min")},Rp=(e,t)=>{Ge(e,"ReduceProdShared",t,"prod")},Bp=(e,t)=>{Ge(e,"ReduceSumShared",t,"sum")},Dp=(e,t)=>{Ge(e,"ReduceSumSquareShared",t,"sumSquare")},Mp=(e,t)=>{Ge(e,"ReduceLogSumShared",t,"logSum")}}),He,Mo,ti,Da,Ke,No,Po,Uo,Wo,Lo,qo,Vo,jo,Fo,Go,Ze,Np,Pp,Up,Wp,Lp,qp,Vp,jp,Fp,Gp,hn=q(()=>{ne(),oe(),Te(),ue(),Wg(),He=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Mo=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ti=(e,t,r,a,n,i,s=!1,u=!1)=>{let l=[],d=r[0].dims,c=d.length,h=B.normalizeAxes(n,c),m=!u&&h.length===0;d.forEach((b,x)=>{m||h.indexOf(x)>=0?s&&l.push(1):l.push(b)});let _=l.length,y=B.size(l);return{name:e,shaderCache:t,getShaderSource:b=>{let x=[],$=M("_A",r[0].dataType,c),w=Q("output",i,_),C=a($,w,h),S=C[2];for(let T=0,k=0;T<c;T++)m||h.indexOf(T)>=0?(s&&k++,S=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${C[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${$.indicesSet("input_indices",T,`j${T}`)}
                  ${S}
                }`):(x.push(`${$.indicesSet("input_indices",T,w.indicesGet("output_indices",k))};`),k++);return`

        ${b.registerUniform("output_size","u32").declareVariables($,w)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${C[0]}       // init ops for reduce max/min
          ${C[1]}
          ${S}
          ${C[3]}
          ${C.length===4?w.setByOffset("global_idx","value"):C.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:i}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...ee(d,l)]})}},Da=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),me({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ke=(e,t,r,a)=>{let n=e.inputs,i=n.length===1?r:Da(n,r);e.compute(ti(t,{hint:i.cacheKey,inputDependencies:["rank"]},[n[0]],i.noopWithEmptyAxes&&i.axes.length===0?Mo:a,i.axes,n[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},No=(e,t)=>{He(e.inputs),Ke(e,"ReduceLogSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Po=(e,t)=>{He(e.inputs),Ke(e,"ReduceL1",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Uo=(e,t)=>{He(e.inputs),Ke(e,"ReduceL2",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Wo=(e,t)=>{He(e.inputs),Ke(e,"ReduceLogSumExp",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Lo=(e,t)=>{He(e.inputs),Ke(e,"ReduceMax",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(r.indicesSet("input_indices",s,0));return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},qo=(e,t)=>{He(e.inputs),Ke(e,"ReduceMean",t,(r,a,n)=>{let i=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(i*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${i});`]})},Vo=(e,t)=>{He(e.inputs),Ke(e,"ReduceMin",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(`input_indices[${s}] = 0;`);return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},jo=(e,t)=>{He(e.inputs),Ke(e,"ReduceProd",t,(r,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Fo=(e,t)=>{He(e.inputs),Ke(e,"ReduceSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Go=(e,t)=>{He(e.inputs),Ke(e,"ReduceSumSquare",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Ze=(e,t,r)=>{if(t.length===0)return r;let a=1,n=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?a*=e[i]:n*=e[i];return n<32&&a>1024},Np=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qo(e,t):Ip(e,t)},Pp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Po(e,t):kp(e,t)},Up=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uo(e,t):Ep(e,t)},Wp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wo(e,t):Ap(e,t)},Lp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lo(e,t):zp(e,t)},qp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vo(e,t):Op(e,t)},Vp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jo(e,t):Rp(e,t)},jp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fo(e,t):Bp(e,t)},Fp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Go(e,t):Dp(e,t)},Gp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?No(e,t):Mp(e,t)}}),Qi,Hp,Kp,Ma,Lg=q(()=>{ne(),Te(),hn(),Qi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Hp=(e,t)=>{Qi(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ti("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Kp=(e,t)=>{Qi(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ti("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ma=e=>me(e)}),Ho,Lr,Ko,Zo,Yo,Cr,Xo,Zp,mn=q(()=>{ne(),oe(),cn(),ue(),Ho=(e,t)=>{let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=n.dims[0]/3,m=h,_=m;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let C of t.qkvHiddenSizes)if(C%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],m=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let y=d;if(h!==m)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==h+m+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(s){if(m!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==m/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=s.dims[3])}let x=y+b,$=-1,w=0;if(i)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:b,kvSequenceLength:y,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:c,hiddenSize:h,vHiddenSize:_,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Lr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Ko=(e,t,r,a,n,i,s,u)=>{let l=Ce(s?1:i),d=64,c=i/l;c<d&&(d=32);let h=Math.ceil(i/l/d),m=[{type:12,data:t},{type:12,data:r},{type:12,data:a},{type:12,data:n},{type:12,data:c},{type:12,data:h}],_=Ee(e.dataType,l),y=Oe(1,l),b=["type"];s&&b.push("type"),u&&b.push("type");let x=$=>{let w=Q("x",e.dataType,e.dims,l),C=[w],S=s?M("seq_lens",s.dataType,s.dims):void 0;S&&C.push(S);let T=u?M("total_sequence_length_input",u.dataType,u.dims):void 0;T&&C.push(T);let k=Oe(e.dataType),A=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(A).declareVariables(...C)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Lr(S,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${k}(1.0) / ${k}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${k}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${_};${l}`,inputDependencies:b},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:m})}},Zo=(e,t,r,a,n,i,s,u,l)=>{let d=s+i.kvSequenceLength,c=[i.batchSize,i.numHeads,i.sequenceLength,d],h=e>1&&a,m=i.kvNumHeads?i.kvNumHeads:i.numHeads,_=h?[i.batchSize,m,d,i.headSize]:void 0,y=i.nReps?i.nReps:1,b=i.scale===0?1/Math.sqrt(i.headSize):i.scale,x=Ce(i.headSize),$=i.headSize/x,w=12,C={x:Math.ceil(d/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},S=[{type:12,data:i.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:b},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:y}],T=h&&a&&B.size(a.dims)>0,k=["type","type"];T&&k.push("type"),n&&k.push("type"),u&&k.push("type"),l&&k.push("type");let A=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&A.push({dims:_,dataType:t.dataType,gpuDataType:0});let z=O=>{let W=M("q",t.dataType,t.dims,x),V=M("key",r.dataType,r.dims,x),F=[W,V];if(T){let te=M("past_key",a.dataType,a.dims,x);F.push(te)}n&&F.push(M("attention_bias",n.dataType,n.dims));let U=u?M("seq_lens",u.dataType,u.dims):void 0;U&&F.push(U);let K=l?M("total_sequence_length_input",l.dataType,l.dims):void 0;K&&F.push(K);let ie=Q("output",t.dataType,c),Y=[ie];h&&Y.push(Q("present_key",t.dataType,_,x));let se=Oe(1,x),Z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${W.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${W.type.storage}, ${w*w}>;
  ${O.registerUniforms(Z).declareVariables(...F,...Y)}
  ${O.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Lr(U,K,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${se}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${se}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${ie.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${n!==void 0};${a!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:A,dispatchGroup:C,programUniforms:S}),getShaderSource:z}},Yo=(e,t,r,a,n,i,s=void 0,u=void 0)=>{let l=i+n.kvSequenceLength,d=n.nReps?n.nReps:1,c=n.vHiddenSize*d,h=e>1&&a,m=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=h?[n.batchSize,m,l,n.headSize]:void 0,y=[n.batchSize,n.sequenceLength,c],b=12,x={x:Math.ceil(n.vHeadSize/b),y:Math.ceil(n.sequenceLength/b),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:i},{type:12,data:n.kvSequenceLength},{type:12,data:d}],w=h&&a&&B.size(a.dims)>0,C=["type","type"];w&&C.push("type"),s&&C.push("type"),u&&C.push("type");let S=[{dims:y,dataType:t.dataType,gpuDataType:0}];h&&S.push({dims:_,dataType:t.dataType,gpuDataType:0});let T=k=>{let A=M("probs",t.dataType,t.dims),z=M("v",r.dataType,r.dims),O=[A,z];w&&O.push(M("past_value",a.dataType,a.dims));let W=s?M("seq_lens",s.dataType,s.dims):void 0;s&&O.push(W);let V=u?M("total_sequence_length_input",u.dataType,u.dims):void 0;u&&O.push(V);let F=[Q("output",t.dataType,y)];h&&F.push(Q("present_value",t.dataType,_));let U=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${A.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${A.type.value}, ${b*b}>;
  ${k.registerUniforms(U).declareVariables(...O,...F)}
  ${k.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Lr(W,V,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${A.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:S,dispatchGroup:x,programUniforms:$}),getShaderSource:T}},Cr=(e,t,r,a,n,i,s,u,l,d,c=void 0,h=void 0)=>{let m=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=m>1?d.pastSequenceLength:0,y=_+d.kvSequenceLength,b=l&&B.size(l.dims)>0?l:void 0,x=[t,r];m>1&&s&&B.size(s.dims)>0&&x.push(s),b&&x.push(b),c&&x.push(c),h&&x.push(h);let $=e.compute(Zo(m,t,r,s,b,d,_,c,h),{inputs:x,outputs:m>1?[-1,1]:[-1]})[0];e.compute(Ko($,d.batchSize,d.numHeads,_,d.sequenceLength,y,c,h),{inputs:c&&h?[$,c,h]:[$],outputs:[]});let w=[$,a];m>1&&u&&B.size(u.dims)>0&&w.push(u),c&&w.push(c),h&&w.push(h),e.compute(Yo(m,$,a,u,d,_,c,h),{inputs:w,outputs:m>1?[0,2]:[0]})},Xo=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,n=t.inputHiddenSize,i=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:a},{type:12,data:n},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let m=Q("output_q",l[0].dataType,r),_=Q("output_k",l[0].dataType,r),y=Q("output_v",l[0].dataType,r),b=M("input",l[0].dataType,l[0].dims),x=M("weight",l[1].dataType,l[1].dims),$=M("bias",l[2].dataType,l[2].dims),w=b.type.storage,C=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${h.registerUniforms(C).declareVariables(b,x,$,m,_,y)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},Zp=(e,t)=>{let r=Ho(e.inputs,t),[a,n,i]=Xo(e,r);return Cr(e,a,n,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Qo,Jo,eu,Yp,qg=q(()=>{Fe(),ne(),oe(),Te(),ue(),Qo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(a,n,i)=>{let s=n.length;if(s!==a.length)throw new Error(`${i}: num dimensions != ${s}`);n.forEach((u,l)=>{if(u!==a[l])throw new Error(`${i}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,a,"Invalid input scale"),r(e[2].dims,a,"Invalid input B"),r(e[3].dims,a,"Invalid input mean"),r(e[4].dims,a,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Jo=(e,t)=>{let{epsilon:r,spatial:a,format:n}=t,i=e[0].dims,s=a?Ce(i[i.length-1]):1,u=n==="NHWC"&&i.length>1?s:1,l=B.size(i)/s,d=a,c=d?i.length:i,h=M("x",e[0].dataType,e[0].dims,s),m=M("scale",e[1].dataType,e[1].dims,u),_=M("bias",e[2].dataType,e[2].dims,u),y=M("inputMean",e[3].dataType,e[3].dims,u),b=M("inputVar",e[4].dataType,e[4].dims,u),x=Q("y",e[0].dataType,c,s),$=()=>{let C="";if(a)C=`let cOffset = ${i.length===1?"0u":n==="NHWC"?`outputIndices[${i.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")C=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{C=`var cIndices = ${m.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let S=1;S<m.rank;S++)C+=`cIndices[${S}] = outputIndices[${S}];`;C+=`let cOffset = ${m.indicesToOffset("cIndices")};`}return C},w=C=>`
  const epsilon = ${r};
  ${C.registerUniform("outputSize","u32").declareVariables(h,m,_,y,b,x)}
  ${C.mainStart()}
  ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${m.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...ee(i)]:[{type:12,data:l}]})}},eu=e=>me(e),Yp=(e,t)=>{let{inputs:r,outputCount:a}=e,n=eu({...t,outputCount:a});if(le.webgpu.validateInputContent&&Qo(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Jo(r,n))}}),tu,ru,Xp,Vg=q(()=>{oe(),ue(),tu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},ru=e=>{let t=e[0].dims,r=e[0].dims[2],a=B.size(t)/4,n=e[0].dataType,i=M("input",n,t,4),s=M("bias",n,[r],4),u=M("residual",n,t,4),l=Q("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(i,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},Xp=e=>{tu(e.inputs),e.compute(ru(e.inputs))}}),iu,fe,Qp,Jp,ec,tc,rc,ic,ac,nc,sc,au,oc,uc,lc,dc,_r,pc,Xr,cc,fc,hc,mc,gc,yc,_c,bc,wc,vc,$c,xc,Cc,Tc,Sc,Ic,Ji,kc,Na,Pa,Ec,Ac,zc,nu,su,Oc,gn=q(()=>{ne(),oe(),Te(),ue(),iu=(e,t,r,a,n,i,s)=>{let u=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=M("inputData",r,[u],4),c=Q("outputData",a,[u],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(d,c)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},fe=(e,t,r,a,n,i=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(B.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>iu(d,B.size(e.dims),e.dataType,i,r,a,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(B.size(d[0].dims)/64/4)},programUniforms:l})}},Qp=e=>{e.compute(fe(e.inputs[0],"Abs","abs"))},Jp=e=>{e.compute(fe(e.inputs[0],"Acos","acos"))},ec=e=>{e.compute(fe(e.inputs[0],"Acosh","acosh"))},tc=e=>{e.compute(fe(e.inputs[0],"Asin","asin"))},rc=e=>{e.compute(fe(e.inputs[0],"Asinh","asinh"))},ic=e=>{e.compute(fe(e.inputs[0],"Atan","atan"))},ac=e=>{e.compute(fe(e.inputs[0],"Atanh","atanh"))},nc=e=>me(e),sc=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(fe(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},au=e=>{let t,r,a=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return me({min:t,max:r})},oc=(e,t)=>{let r=t||au(e.inputs),a=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},uc=e=>{e.compute(fe(e.inputs[0],"Ceil","ceil"))},lc=e=>{e.compute(fe(e.inputs[0],"Cos","cos"))},dc=e=>{e.compute(fe(e.inputs[0],"Cosh","cosh"))},_r=e=>me(e),pc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Xr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,cc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Xr(t)))},fc=e=>{e.compute(fe(e.inputs[0],"Exp","exp"))},hc=e=>{e.compute(fe(e.inputs[0],"Floor","floor"))},mc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Xr(t)))},gc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},yc=e=>{e.compute(fe(e.inputs[0],"Not",t=>`!${t}`))},_c=e=>{e.compute(fe(e.inputs[0],"Neg",t=>`-${t}`))},bc=e=>{e.compute(fe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},wc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},vc=e=>{e.compute(fe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},$c=e=>me(e),xc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"HardSigmoid",a=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${a} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Cc=e=>{e.compute(fe(e.inputs[0],"Sin","sin"))},Tc=e=>{e.compute(fe(e.inputs[0],"Sinh","sinh"))},Sc=e=>{e.compute(fe(e.inputs[0],"Sqrt","sqrt"))},Ic=e=>{e.compute(fe(e.inputs[0],"Tan","tan"))},Ji=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,kc=e=>{e.compute(fe(e.inputs[0],"Tanh",Ji))},Na=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ji("v")};
}
`,Pa=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Ec=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"FastGelu",Pa,Na(t),void 0,e.inputs[0].dataType))},Ac=(e,t)=>{let r=Oe(e.inputs[0].dataType);return e.compute(fe(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${r}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},zc=e=>{e.compute(fe(e.inputs[0],"Log","log"))},nu=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,su=e=>`quick_gelu_impl(${e})`,Oc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"QuickGelu",su,nu(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),ou,uu,Rc,jg=q(()=>{oe(),ue(),gn(),ou=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},uu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=M("input",e[0].dataType,e[0].dims,4),a=M("bias",e[0].dataType,[e[0].dims[2]],4),n=Q("output",e[0].dataType,t,4),i=B.size(t)/4,s=Ee(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,a,n)}

  ${Xr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Rc=e=>{ou(e.inputs),e.compute(uu(e.inputs))}}),lu,du,Ye,Bc,Dc,Mc,Nc,Pc,Uc,Wc,Lc,qc,Vc,Fg=q(()=>{ne(),oe(),ue(),lu=(e,t,r,a,n,i,s,u,l,d,c,h)=>{let m,_;typeof u=="string"?m=_=(w,C)=>`${u}((${w}),(${C}))`:typeof u=="function"?m=_=u:(m=u.scalar,_=u.vector);let y=Q("outputData",c,a.length,4),b=M("aData",l,t.length,4),x=M("bData",d,r.length,4),$;if(n)if(i){let w=B.size(t)===1,C=B.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;w||C?$=y.setByOffset("global_idx",_(w?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),C?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",_(s||S?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=y.setByOffset("global_idx",_(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(C,S,T="")=>{let k=`aData[indexA${S}][componentA${S}]`,A=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${y.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${b.broadcastedIndicesToOffset(`outputIndices${S}`,y)};
            let offsetB${S} = ${x.broadcastedIndicesToOffset(`outputIndices${S}`,y)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${C}[${S}] = ${T}(${m(k,A)});
          `};c===9?$=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,y)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},du=(e,t,r,a,n,i,s=r.dataType)=>{let u=r.dims.map(b=>Number(b)??1),l=a.dims.map(b=>Number(b)??1),d=!B.areEqual(u,l),c=u,h=B.size(u),m=!1,_=!1,y=[d];if(d){let b=Qt.calcShape(u,l,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");c=b.slice(),h=B.size(c);let x=B.size(u)===1,$=B.size(l)===1,w=u.length>0&&u[u.length-1]%4===0,C=l.length>0&&l[l.length-1]%4===0;y.push(x),y.push($),y.push(w),y.push(C);let S=1;for(let T=1;T<c.length;T++){let k=u[u.length-T],A=l[l.length-T];if(k===A)S*=k;else break}S%4===0?(_=!0,m=!0):(x||$||w||C)&&(m=!0)}else m=!0;return y.push(m),{name:e,shaderCache:{hint:t+y.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>lu(b,u,l,c,m,d,_,n,r.dataType,a.dataType,s,i),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(B.size(c)/4)},...ee(u,l,c)]})}},Ye=(e,t,r,a,n,i)=>{e.compute(du(t,n??"",e.inputs[0],e.inputs[1],r,a,i))},Bc=e=>{Ye(e,"Add",(t,r)=>`${t}+${r}`)},Dc=e=>{Ye(e,"Div",(t,r)=>`${t}/${r}`)},Mc=e=>{Ye(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Nc=e=>{Ye(e,"Mul",(t,r)=>`${t}*${r}`)},Pc=e=>{let t=M("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Ye(e,"Pow",{scalar:(r,a)=>`pow_custom(${r},${a})`,vector:(r,a)=>`pow_vector_custom(${r},${a})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Uc=e=>{Ye(e,"Sub",(t,r)=>`${t}-${r}`)},Wc=e=>{Ye(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Lc=e=>{Ye(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},qc=e=>{Ye(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Vc=e=>{Ye(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),pu,cu,fu,hu,jc,Fc,Gg=q(()=>{ne(),oe(),Te(),ue(),pu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,a=e[r],n=a.dataType,i=a.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==i)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==a.dims[d])throw new Error("non concat dimensions must match")})}})},cu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,fu=(e,t)=>{let r=e.length,a=[];for(let n=0;n<r;++n){let i=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?a.push(i):n===0?a.push(`if (inputIndex == ${n}u) { ${i} }`):n===r-1?a.push(`else { ${i} }`):a.push(`else if (inputIndex == ${n}) { ${i} }`)}return a.join(`
`)},hu=(e,t,r,a)=>{let n=B.size(r),i=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],c=[{type:12,data:n}];for(let b=0;b<e.length;++b)u+=e[b].dims[t],i[b]=u,d.push(e[b].dims.length),s[b]=M(`input${b}`,a,d[b]),l.push("rank"),c.push({type:12,data:i[b]});for(let b=0;b<e.length;++b)c.push(...ee(e[b].dims));c.push(...ee(r));let h=Q("output",a,r.length),m=h.indicesGet("indices",t),_=Array.from(Array(i.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),y=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)b.registerUniform(`sizeInConcatAxis${x}`,"u32");return b.declareVariables(...s,h)})()}

  ${cu(i.length,_)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${m});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${_});
      ${m} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${fu(s,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}),getShaderSource:y}},jc=(e,t)=>{let r=e.inputs,a=r[0].dims,n=B.normalizeAxis(t.axis,a.length);pu(r,n);let i=a.slice();i[n]=r.reduce((u,l)=>u+(l.dims.length>n?l.dims[n]:0),0);let s=r.filter(u=>B.size(u.dims)>0);e.compute(hu(s,n,i,r[0].dataType),{inputs:s})},Fc=e=>me({axis:e.axis})}),Ut,Wt,Lt,yn,Vt=q(()=>{ne(),oe(),Ut=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Wt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Lt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},yn=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,a]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:a}}else if(t==="Clip"){let[r,a]=(e==null?void 0:e.activation_params)||[yp,_p];return{activation:t,clipMax:a,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ze,Gc,_n=q(()=>{ze=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Gc=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Hc,Hg=q(()=>{Hc=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),vr,bn,wn=q(()=>{ne(),oe(),ue(),Vt(),vr=(e,t,r,a,n)=>{let i=a-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${J(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,J(n,u+i,a))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},bn=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],c=s[s.length-1],h=Ce(d),m=Ce(c),_=Ce(l),y=B.size(r)/h/_,b=e.length>2,x=a?a.slice(0,-2):r.slice(0,-2),$=[B.size(x),l,d],w=[{type:12,data:y},{type:12,data:l},{type:12,data:d},{type:12,data:c}];Wt(t,w),w.push(...ee(x,s,u)),b&&w.push(...ee(e[2].dims)),w.push(...ee($));let C=S=>{let T=fn("batch_dims",e[0].dataType,x.length),k=M("a",e[0].dataType,s.length,m),A=M("b",e[1].dataType,u.length,h),z=Q("output",e[0].dataType,$.length,h),O=Ee(z.type.tensor),W=Ut(t,z.type.value,O),V=[k,A],F="";if(b){let ie=n?h:1;V.push(M("bias",e[2].dataType,e[2].dims.length,ie)),F=`${n?`value += bias[col / ${ie}];`:`value += ${z.type.value}(bias[row + i]);`}`}let U=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Lt(t,U);let K=()=>{let ie=`var a_data: ${k.type.value};`;for(let Y=0;Y<m;Y++)ie+=`
              let b_data${Y} = b[(b_offset + (k + ${Y}) * uniforms.N + col) / ${h}];`;for(let Y=0;Y<_;Y++){ie+=`a_data = a[(a_offset + (row + ${Y}) * uniforms.K + k) / ${m}];`;for(let se=0;se<m;se++)ie+=`
            values[${Y}] = fma(${A.type.value}(a_data${m===1?"":`[${se}]`}), b_data${se}, values[${Y}]);
`}return ie};return`
  ${S.registerUniforms(U).registerInternalVariables(T).declareVariables(...V,z)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${k.type.indices};
    ${vr("a_indices",k,k.rank-2,T.rank,"batch_indices")}
    ${k.indicesSet("a_indices",k.rank-2,0)}
    ${k.indicesSet("a_indices",k.rank-1,0)}
    let a_offset = ${k.indicesToOffset("a_indices")};

    var b_indices: ${A.type.indices};
    ${vr("b_indices",A,A.rank-2,T.rank,"batch_indices")}
    ${A.indicesSet("b_indices",A.rank-2,0)}
    ${A.indicesSet("b_indices",A.rank-1,0)}
    let b_offset = ${A.indicesToOffset("b_indices")};
    var values: array<${z.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${m}) {
      ${K()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${F}
      ${W}
      let cur_indices = ${z.type.indices}(batch, row + i, col);
      let offset = ${z.indicesToOffset("cur_indices")};
      ${z.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${m};${_};${n}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:w}),getShaderSource:C}}}),mu,gu,Ua,ea,yu,Wa,_u,ri,vn=q(()=>{ne(),oe(),ue(),Vt(),wn(),_n(),mu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,gu=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ua=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=n?l:i,h=n?i:l,m=c/t[0],_=i/t[1];if(!((n&&m===4&&e[1]===4||!n&&(m===3||m===4))&&c%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${m} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${m} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${m}<${r}>, ${c/m}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${i}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${m};
const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${mu(n,a)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${a?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${m===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${gu(n,m)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},ea=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,yu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Wa=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],h=n?d:i,m=n?i:d;if(!(m%t[1]===0&&h%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${m} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let _=m/t[1],y=h/t[0],b=i/t[1],x=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${m}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${ea(n,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${a?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${ea(n,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${a?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${yu(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${m}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${i}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},_u=(e,t,r,a,n=!1)=>{let[i,s,u,l]=a,d=Ee(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${ze(e,d)} {
      var value = ${ze(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${vr("aIndices",s,s.rank-2,i.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${ze(e,d)} {
      var value = ${ze(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${vr("bIndices",u,u.rank-2,i.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ze(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${ze(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ri=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),c=a?a.slice(0,-2):r.slice(0,-2),h=B.size(c),m=s[s.length-2],_=s[s.length-1],y=u[u.length-1],b=_%4===0&&y%4===0,x=m<=8?[4,1,1]:[4,4,1],$=[8,8,1],w=[Math.ceil(y/$[0]/x[0]),Math.ceil(m/$[1]/x[1]),Math.ceil(h/$[2]/x[2])],C=b?4:1,S=[...l,m,_/C],T=S.length,k=[...d,_,y/C],A=k.length,z=[h,m,y/C],O=[{type:6,data:m},{type:6,data:y},{type:6,data:_}];Wt(t,O),O.push(...ee(c,S,k));let W=["rank","rank"],V=e.length>2;V&&(O.push(...ee(e[2].dims)),W.push("rank")),O.push(...ee(z));let F=U=>{let K=c.length,ie=fn("batchDims",e[0].dataType,K,1),Y=Ee(e[0].dataType),se=M("a",e[0].dataType,T,C),Z=M("b",e[1].dataType,A,C),te=Q("result",e[0].dataType,z.length,C),_e=[se,Z];if(V){let Ie=n?C:1;_e.push(M("bias",e[2].dataType,e[2].dims.length,Ie))}let N=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Lt(t,N);let G=Ee(te.type.tensor),H=Ut(t,te.type.value,G),re=_u(C,V,H,[ie,se,Z,te],n);return`
  ${U.registerUniforms(N).registerInternalVariables(ie).declareVariables(..._e,te)}
  ${re}
  ${b?Ua(x,$,Y,ie):Wa(x,$,Y,ie)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${b};${n}`,inputDependencies:W},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:O}),getShaderSource:F}}}),bu,Kc,Kg=q(()=>{ne(),ct(),ue(),Vt(),_n(),Hg(),vn(),bu=(e,t,r,a,n=!1,i,s=4,u=4,l=4,d="f32")=>{let c=O=>{switch(O){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},h=O=>{switch(O){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},m=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${ze(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${b}) {
      ${m}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,C=e?t&&a?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${ze(s,d)}(0.0);`:a&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${ze(s,d)}(0.0);`,S=e?a&&r?h(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(u)}
    }
    return ${ze(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(u)}
    }
    return ${ze(u,d)}(0.0);`,T=ze(l,d),k=ze(e?s:u,d),A=ze(e?u:s,d),z=Ut(i,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${k} {
      ${e?C:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?S:C}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${Gc(n)}
      ${z}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Kc=(e,t,r,a,n,i,s,u,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],h=r[0],m=d?r[2]:r[3],_=d?r[1]:r[2],y=d?r[3]:r[1],b=d&&(c%4===0||c%3===0)&&y%4===0,x=d?y:m*_,$=d?m*_:y,w=[8,8,1],C=a<=8?[4,1,1]:[4,4,1],S=[Math.ceil(x/w[0]/C[0]),Math.ceil($/w[1]/C[1]),Math.ceil(h/w[2]/C[2])];ce("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let T=b?d&&c%4!==0?3:4:1,k=w[1]*C[1],A=w[0]*C[0],z=Math.max(w[0]*T,w[1]),O=a%k===0,W=n%A===0,V=i%z===0,F=b?[T,4,4]:[1,1,1],U=[{type:6,data:a},{type:6,data:n},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Wt(t,U),U.push(...ee(e[0].dims,e[1].dims));let K=["rank","rank"];s&&(U.push(...ee(e[2].dims)),K.push("rank")),U.push(...ee(r));let ie=Y=>{let se=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Lt(t,se);let Z=b?4:1,te=Ee(e[0].dataType),_e=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${te}>`:te}) {
        result[flatIndex] = ${b?`vec4<${te}>`:te}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${te}>`:te}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,N=M("x",e[0].dataType,e[0].dims.length,T===3?1:T),G=M("w",e[1].dataType,e[1].dims.length,Z),H=[N,G],re=Q("result",e[0].dataType,r.length,Z);if(s){let Ie=M("bias",e[2].dataType,e[2].dims.length,Z);H.push(Ie),_e+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${te}>`:te} {
          return bias[coords.${d?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${Hc("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Y.registerUniforms(se).declareVariables(...H,re)}
        ${_e}
        ${bu(d,O,W,V,s,t,F[0],F[1],F[2],te)}
        ${b?Ua(C,w,te,void 0,!d,z):Wa(C,w,te,void 0,!d,z,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${b};${O};${W};${V};${k};${A};${z}`,inputDependencies:K},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:U}),getShaderSource:ie}}}),wu,ta,dr,vu,ra,$u,Zc,Yc,Zg=q(()=>{ne(),ct(),oe(),ue(),Vt(),_n(),wu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},ta=e=>typeof e=="number"?[e,e,e]:e,dr=(e,t)=>t<=1?e:e+(e-1)*(t-1),vu=(e,t,r,a=1)=>{let n=dr(t,a);return Math.floor((e[0]*(r-1)-r+n)/2)},ra=(e,t,r,a,n)=>{n==null&&(n=vu(e,t[0],a[0]));let i=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(i[s]=Math.trunc((e[s]-t[s]+2*n)/a[s]+1));return i},$u=(e,t,r,a,n,i,s,u,l,d)=>{let c,h,m,_;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=ra([t,r,a,1],[u,l,d],1,[n,i,s],e);h=y[0],m=y[1],_=y[2]}else if(Array.isArray(e)){if(!e.every((b,x,$)=>b===$[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=ra([t,r,a,1],[u,l,d],1,[n,i,s],e[0]);h=y[0],m=y[1],_=y[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/n),m=Math.ceil(r/i),_=Math.ceil(a/s);let y=(h-1)*n+u-t,b=(m-1)*i+l-r,x=(_-1)*s+d-a,$=Math.floor(y/2),w=y-$,C=Math.floor(b/2),S=b-C,T=Math.floor(x/2),k=x-T;c={top:C,bottom:S,left:T,right:k,front:$,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:m,outWidth:_}},Zc=(e,t,r,a,n,i=!1,s="channelsLast")=>{let u,l,d,c,h;if(s==="channelsLast")[u,l,d,c,h]=e;else if(s==="channelsFirst")[u,h,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[m,,_,y,b]=t,[x,$,w]=ta(r),[C,S,T]=ta(a),k=dr(_,C),A=dr(y,S),z=dr(b,T),{padInfo:O,outDepth:W,outHeight:V,outWidth:F}=$u(n,l,d,c,x,$,w,k,A,z),U=i?m*h:m,K=[0,0,0,0,0];return s==="channelsFirst"?K=[u,U,W,V,F]:s==="channelsLast"&&(K=[u,W,V,F,U]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:h,outDepth:W,outHeight:V,outWidth:F,outChannels:U,padInfo:O,strideDepth:x,strideHeight:$,strideWidth:w,filterDepth:_,filterHeight:y,filterWidth:b,effectiveFilterDepth:k,effectiveFilterHeight:A,effectiveFilterWidth:z,dilationDepth:C,dilationHeight:S,dilationWidth:T,inShape:e,outShape:K,filterShape:t}},Yc=(e,t,r,a,n,i)=>{let s=i==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((x,$)=>$)},d=[Math.ceil(wu(l.x.map(x=>r[x]))/u[0]),1,1];ce("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let c=1,h=B.size(r),m=[{type:12,data:h},{type:12,data:a},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Wt(t,m),m.push(...ee(e[0].dims,e[1].dims));let _=["rank","rank"],y=e.length===3;y&&(m.push(...ee(e[2].dims)),_.push("rank")),m.push(...ee(r));let b=x=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Lt(t,$);let w=1,C=Ee(e[0].dataType),S=M("x",e[0].dataType,e[0].dims.length,c),T=M("W",e[1].dataType,e[1].dims.length,w),k=[S,T],A=Q("result",e[0].dataType,r.length,w),z="";if(y){let V=M("bias",e[2].dataType,e[2].dims.length,w);k.push(V),z+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${C} {
          return bias[${s?J("coords",4,5):J("coords",1,5)}];
        }`}let O=ze(c,C),W=Ut(t,O,C);return`
            ${z}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
          ${x.registerUniforms($).declareVariables(...k,A)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${A.offsetToIndices("global_idx")};
              let batch = ${J("coords",0,S.rank)};
              let d2 = ${s?J("coords",S.rank-1,S.rank):J("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${s?J("coords",1,S.rank):J("coords",2,S.rank)},
              ${s?J("coords",2,S.rank):J("coords",3,S.rank)},
              ${s?J("coords",3,S.rank):J("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?J("uniforms.x_shape",1,S.rank):J("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${s?J("uniforms.x_shape",2,S.rank):J("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${s?J("uniforms.x_shape",3,S.rank):J("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${s?J("uniforms.x_shape",4,S.rank):J("uniforms.x_shape",1,S.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${y?"value = value + getBiasByOutputCoords(coords)":""};
              ${W}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${y}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:m}),getShaderSource:b}}}),Xc,Qc,Yg=q(()=>{ne(),oe(),ue(),Vt(),Xc=(e,t,r,a)=>{let n=e.length>2,i=n?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,h=l&&c>=4?Ce(d):1,m=B.size(r)/h,_=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Wt(t,_),_.push(...ee(s,[u[0],u[1],u[2],u[3]/h]));let y=n?["rank","rank","rank"]:["rank","rank"];_.push(...ee([r[0],r[1],r[2],r[3]/h]));let b=x=>{let $=Q("output",e[0].dataType,r.length,h),w=Ee($.type.tensor),C=Ut(t,$.type.value,w),S=M("x",e[0].dataType,s.length),T=M("w",e[1].dataType,u.length,h),k=[S,T];n&&k.push(M("b",e[2].dataType,e[2].dims,h));let A=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Lt(t,A);let z=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${T.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(A).declareVariables(...k,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${z}
    ${i}
    ${C}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:b}},Qc=(e,t,r,a)=>{let n=e.length>2,i=Ce(r[3]),s=Ce(r[2]),u=B.size(r)/i/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/i],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/i],c=[r[0],r[1],r[2],r[3]/i],h=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Wt(t,h),h.push(...ee(l,d,c));let m=(s-1)*t.strides[1]+d[1],_=y=>{let b=Q("output",e[0].dataType,c.length,i),x=Ee(b.type.tensor),$=Ut(t,b.type.value,x),w=M("x",e[0].dataType,l.length,i),C=M("w",e[1].dataType,d.length,i),S=[w,C];n&&S.push(M("b",e[2].dataType,e[2].dims,i));let T=n?"value += b[output_channel];":"",k=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Lt(t,k),`
  ${y.registerUniforms(k).declareVariables(...S,b)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${m}>;
    var values: array<${b.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${m}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${C.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${$}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${i};${s};${m};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:_}}}),xu,qr,Cu,Vr,La,ia,Tu,Su,qa,Xg=q(()=>{oe(),Kg(),Zg(),vn(),Yg(),Vt(),wn(),Ct(),xu=(e,t,r,a,n,i)=>{let s=e[0],u=e.slice(i?1:2,i?3:4),l=u.length,d=t[0],c=t.slice(2).map((m,_)=>m+(m-1)*(r[_]-1)),h=u.map((m,_)=>m+a[_]+a[_+l]).map((m,_)=>Math.floor((m-c[_]+n[_])/n[_]));return h.splice(0,0,s),h.splice(i?3:1,0,d),h},qr=[2,3,1,0],Cu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Vr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let a=e.pads.slice();ei.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,a,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:a}),n},La=e=>{let t=yn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,i=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},ia=(e,t,r,a)=>{let n=r.format==="NHWC",i=xu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let k=[t[0]];if(n){let A=e.kernelCustomData.wT??e.compute(qe(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=A),k.push(A)}else k.push(t[1]);t.length===3&&k.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Qc(k,r,i,a),{inputs:k}):e.compute(Xc(k,r,i,a),{inputs:k});return}let s=t.length===3,u=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],c=t[1].dims[2],h=t[1].dims[3],m=i[n?1:2],_=i[n?2:3],y=i[n?3:1],b=n&&c===u&&h===l&&r.pads[0]===0&&r.pads[1]===0;if(b||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let k=i[0],A,z,O,W=[];if(n){let U=e.kernelCustomData.wT??e.compute(qe(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=U),b){let K=u*l*d;A=t[0].reshape([1,k,K]),z=U.reshape([1,K,y]),O=[1,k,y]}else A=t[0].reshape([k,u*l,d]),z=U.reshape([1,d,y]),O=[k,m*_,y];W.push(A),W.push(z)}else A=t[0].reshape([k,d,u*l]),z=t[1].reshape([1,y,d]),O=[k,y,m*_],W.push(z),W.push(A);s&&W.push(t[2]);let V=O[2],F=W[0].dims[W[0].dims.length-1];V<8&&F<8?e.compute(bn(W,r,i,O,n,a),{inputs:W}):e.compute(ri(W,r,i,O,n,a),{inputs:W});return}let x=!0,$=e.kernelCustomData.wT??e.compute(qe(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let w=[t[0],$];s&&w.push(t[2]);let C=n?m*_:y,S=n?y:m*_,T=c*h*d;e.compute(Kc(w,r,i,C,S,T,s,x,a),{inputs:w})},Tu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Vr({...t,pads:n,strides:i,dilations:s,kernelShape:u},a);ia(e,a,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Su=(e,t,r)=>{let a=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Vr(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Zc(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,a);e.compute(Yc(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],a))},qa=(e,t)=>{if(Cu(e.inputs,t),e.inputs[0].dims.length===3)Tu(e,t);else if(e.inputs[0].dims.length===5)Su(e,e.inputs,t);else{let r=Vr(t,e.inputs);ia(e,e.inputs,r)}}}),Jc,Qg=q(()=>{ne(),ct(),oe(),ue(),Jc=(e,t,r)=>{let a=e.length>2,n=t.outputShape,i=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],c=i?Ce(l):1,h=i&&d===1&&l>=4,m=h?Math.floor(l/4)*4:Math.floor(l/c)*c,_=l-m,y=i?Ce(d):1,b=i?d===1?c:y:1,x=B.size(n)/y,$=[Math.ceil(x/64),1,1];ce("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let w=["rank","rank"],C=[t.strides[0],t.strides[1]],S=[t.kernelShape[i?1:2],t.kernelShape[i?2:3]],T=[t.dilations[0],t.dilations[1]],k=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[i?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[i?2:3]-1)*(t.dilations[1]-1))],A=[k[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),k[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],z=[{type:12,data:x},{type:12,data:C},{type:12,data:S},{type:12,data:T},{type:12,data:k},{type:6,data:A},{type:12,data:m},{type:12,data:l},{type:12,data:d},...ee(e[0].dims,e[1].dims)];a&&(z.push(...ee(e[2].dims)),w.push("rank")),z.push(...ee(n));let O=W=>{let V=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:C.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:k.length},{name:"pads",type:"i32",length:A.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],F=Ee(e[0].dataType),U=i?1:2,K=i?2:3,ie=i?3:1,Y=M("W",e[1].dataType,e[1].dims.length,b),se=M("Dy",e[0].dataType,e[0].dims.length,c),Z=[se,Y];a&&Z.push(M("bias",e[2].dataType,[n[ie]].length,y));let te=Q("result",e[0].dataType,n.length,y),_e=()=>{let H="";if(h)c===4?H+=`
        let xValue = ${se.getByOffset("x_offset")};
        let wValue = ${Y.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?H+=`
          dotProd = dotProd + dot(vec4<${F}>(${se.getByOffset("x_offset")}, ${se.getByOffset("x_offset + 1u")}), vec4<${F}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(H+=`
          dotProd = dotProd + dot(vec4<${F}>(${se.getByOffset("x_offset")}, ${se.getByOffset("x_offset + 1u")}, ${se.getByOffset("x_offset + 2u")}, ${se.getByOffset("x_offset + 3u")}), vec4<${F}>(${Y.getByOffset("w_offset")}, ${Y.getByOffset("w_offset + 1u")}, ${Y.getByOffset("w_offset + 2u")}, ${Y.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(H+=`
                  let xValue = ${i?se.getByOffset(`${se.indicesToOffset(`${se.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):se.get("batch","inputChannel","idyR","idyC")};
        `,c===1)H+=`
          let w_offset = ${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Y.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let re=0;re<c;re++)H+=`
            let wValue${re} = ${Y.getByOffset(`${Y.indicesToOffset(`${Y.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${re}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${re}] * wValue${re};`;return H},N=()=>{if(_===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let H="";if(c===1){H+="dotProd = dotProd";for(let re=0;re<_;re++)H+=`
            + ${se.getByOffset(`x_offset + ${re}`)} * ${Y.getByOffset(`w_offset + ${re}`)}`;H+=";"}else if(c===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);H+=`
          let xValue = ${se.getByOffset("x_offset")};
          let wValue = ${Y.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return H},G=`
            let outputIndices = ${te.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${te.indicesGet("outputIndices",0)};
            let d1 = ${te.indicesGet("outputIndices",ie)};
            let r = ${te.indicesGet("outputIndices",U)};
            let c = ${te.indicesGet("outputIndices",K)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${te.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${F}(dyRCorner) + ${F}(wR)) / ${F}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${F}(uniforms.Dy_shape[${U}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${F}(dyCCorner) + ${F}(wC)) / ${F}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${F}(uniforms.Dy_shape[${K}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${se.indicesToOffset(`${se.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${Y.indicesToOffset(`${Y.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${_e()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${N()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${y}]`:""};
            ${te.setByOffset("global_idx","value")};
          `;return`
    ${W.registerUniforms(V).declareVariables(...Z,te)}
      ${W.mainStart()}
      ${W.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${G}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${b}${y}${h}${_}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:z}),getShaderSource:O}}}),Iu,ku,Eu,aa,ef,Au,na,zu,tf,Jg=q(()=>{Qg(),Vt(),Ct(),Iu=(e,t,r,a,n,i)=>(e-1)*t+r+(a-1)*n+1-i,ku=(e,t,r,a,n)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[a]=i,r[n]=e-i):t==="SAME_LOWER"&&(r[a]=e-i,r[n]=i)},Eu=(e,t,r,a,n,i,s,u,l,d)=>{let c=e.length-2,h=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let m=e[0],_=t[u?3:1]*n;for(let y=0,b=e.length-c-(u?1:0);y<c;++y,++b){let x=e[b],$=h?x*s[y]:d[y],w=Iu(x,s[y],i[y],t[b],r[y],$);ku(w,a,i,y,y+c),h&&d.push(s[y]*(x-1)+l[y]+(t[b]-1)*r[y]+1-i[y]-i[y+c])}d.splice(0,0,m),d.splice(u?3:1,0,_)},aa=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,m)=>h*m,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let a=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(a?3:1,0,t[1].dims[1]);let n=e.pads.slice(),i=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let d=e.strides.slice();if(d.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;d=new Array(h).fill(1)}Eu(u,r,l,e.autoPad,e.group,n,d,a,s,i);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:i,dilations:l,strides:d}),c},ef=e=>{let t=yn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,i=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,outputPadding:c,outputShape:h,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Au=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},na=(e,t,r,a)=>{let n=e.kernelCustomData.wT??e.compute(qe(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let i=[t[0],n];t.length===3&&i.push(t[2]),e.compute(Jc(i,r,a),{inputs:i})},zu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),i=[1].concat(i),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=aa({...t,pads:u,strides:s,dilations:i,kernelShape:n,outputPadding:l},a);na(e,a,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},tf=(e,t)=>{if(Au(e.inputs,t),e.inputs[0].dims.length===3)zu(e,t);else{let r=aa(t,e.inputs);na(e,e.inputs,r)}}}),Ou,rf,af,ey=q(()=>{ne(),oe(),Te(),ue(),Ou=(e,t,r,a)=>{let n=B.size(t),i=t.length,s=M("input",e,i),u=Q("output",e,i),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=B.normalizeAxis(l,i),c=h=>{let m=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=J("uniforms.input_shape","uniforms.axis",i),y=a.reverse?m+(a.exclusive?" + 1":""):"0",b=a.reverse?_:m+(a.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...ee(t,t)]}),getShaderSource:c}},rf=(e,t)=>{let r=e.inputs[0].dims,a=e.inputs[0].dataType,n=e.inputs[1];e.compute(Ou(a,r,n,t),{inputs:[0]})},af=e=>{let t=e.exclusive===1,r=e.reverse===1;return me({exclusive:t,reverse:r})}}),Ru,Bu,Du,nf,sf,ty=q(()=>{ne(),oe(),Te(),ue(),Ru=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Bu=(e,t,r,a)=>{let n=[];n.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)n.push(r.indicesSet("a",e[i],`i[${i}]`));return n.push("return a;}"),n.join(`
`)},Du=(e,t)=>{let r,a,n,i,s,u,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,a,n,i]=e.dims,s=c?[r,a,n,d,d,i/d**2]:[r,a,n,i/d**2,d,d],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,a,n,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,i/d**2,a,n]:[r,i/d**2,d,d,a,n],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),m=h.dims.length,_=e.dataType,y=M("a",_,m),b=Q("output",_,m),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(y,b)}

  ${Bu(u,m,y,b)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let w=l?[r,a*d,n*d,i/d**2]:[r,i/d**2,a*d,n*d],C=B.size(w),S=h.dims,T=B.sortBasedOnPerm(S,u);return{outputs:[{dims:w,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(C/64)},programUniforms:[{type:12,data:C},...ee(S,T)]}},getShaderSource:x}},nf=(e,t)=>{Ru(e.inputs),e.compute(Du(e.inputs[0],t))},sf=e=>me({blocksize:e.blocksize,mode:e.mode,format:e.format})}),jr,pr,sa,Mu,Nu,Pu,Uu,oa,Wu,of,uf,ry=q(()=>{ne(),oe(),Te(),ue(),jr="[a-zA-Z]|\\.\\.\\.",pr="("+jr+")+",sa="^"+pr+"$",Mu="("+pr+",)*"+pr,Nu="^"+Mu+"$",Pu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Uu=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,a]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Nu)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let u=e[s].dims.slice();if(!i.match(RegExp(sa)))throw new Error("Invalid LHS term");let l=this.processTerm(i,!0,u,s);this.lhs.push(l)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!a.match(RegExp(pr)))throw new Error("Invalid RHS");(n=a.match(RegExp(jr,"g")))==null||n.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,r){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,a)}processTerm(e,t,r,a=-1){let n=r.length,i=!1,s=[],u=0;if(!e.match(RegExp(sa))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(jr,"g")),d=new Pu(a);return l==null||l.forEach((c,h)=>{if(c==="..."){if(i)throw new Error("Only one ellipsis is allowed per input term");i=!0;let m=n-l.length+1;if(m<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+m),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let y=String.fromCharCode(48+_);d.addSymbol(y,h+_),this.addSymbol(y,r[u++],a)}}else d.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],a)}),d}},oa=e=>e+"_max",Wu=(e,t,r,a)=>{let n=e.map(d=>d.length).map((d,c)=>M(`input${c}`,t,d)),i=B.size(a),s=Q("output",t,a.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],h="var prod = 1.0;",m="var sum = 0.0;",_="sum += prod;",y=[],b=[],x=[],$=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,T)=>{var k;if(r.rhs.symbolToIndices.has(T)){let A=(k=r.rhs.symbolToIndices.get(T))==null?void 0:k[0];A!==void 0&&r.lhs.forEach((z,O)=>{if(S.inputIndices.includes(O)){let W=z.symbolToIndices.get(T);if(W===void 0)throw new Error("Invalid symbol error");W.forEach(V=>{c.push(`${n[O].indicesSet(`input${O}Indices`,V,s.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,z)=>{if(S.inputIndices.includes(z)){let O=A.symbolToIndices.get(T);if(O===void 0)throw new Error("Invalid symbol error");O.forEach(W=>{y.push(`${n[z].indicesSet(`input${z}Indices`,W,`${T}`)}`)}),$.push(`prod *= ${n[z].getByIndices(`input${z}Indices`)};`)}}),b.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${oa(T)}; ${T}++) {`),x.push("}")});let C=w?[...c,`let sum = ${n.map((S,T)=>S.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...c,m,...b,...y,h,...$,_,...x];return`
            ${d.registerUniforms(u.map(S=>({name:`${oa(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((S,T)=>`var input${T}Indices: ${n[T].type.indices};`).join(`
`)}
            ${C.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(h=>r.symbolToInfo.has(h)).map(h=>{var m;return{type:12,data:((m=r.symbolToInfo.get(h))==null?void 0:m.dimValue)||0}});d.push({type:12,data:i});let c=e.map((h,m)=>[...ee(h)]).reduce((h,m)=>h.concat(m),d);return c.push(...ee(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c}},getShaderSource:l}},of=(e,t)=>{let r=new Uu(e.inputs,t.equation),a=r.outputDims,n=e.inputs.map((i,s)=>i.dims);e.compute(Wu(n,e.inputs[0].dataType,r,a))},uf=e=>{let t=e.equation.replace(/\s+/g,"");return me({equation:t})}}),Lu,ua,qu,Vu,lf,iy=q(()=>{ne(),oe(),ue(),Lu=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;a<r.length&&n<t.length;++a,++n)if(r[a]!==t[n]&&r[a]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ua=(e,t)=>{let r=e.length-t.length,a=[];for(let n=0;n<r;++n)a.push(e[n]);for(let n=0;n<t.length;++n)a.push(t[n]===1?e[n+r]:t[n]);return a},qu=(e,t)=>e.length>t.length?ua(e,t):ua(t,e),Vu=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=qu(t,r),n=e[0].dataType,i=n===9||B.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,u=i||a.length>0&&a[a.length-1]%4===0?4:1,l=Math.ceil(B.size(a)/u),d=h=>{let m=M("input",n,t.length,s),_=Q("output",n,a.length,u),y;if(n===9){let b=(x,$,w="")=>`
          let outputIndices${$} = ${_.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${m.broadcastedIndicesToOffset(`outputIndices${$}`,_)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${w}(${m.getByOffset(`index${$}`)}[component${$}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${m.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${m.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(m,_)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},c=[{type:12,data:l},...ee(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},lf=e=>{Lu(e.inputs),e.compute(Vu(e.inputs),{inputs:[0]})}}),ju,df,ay=q(()=>{ne(),oe(),ue(),gn(),ju=e=>{let t=e[0].dataType,r=B.size(e[0].dims),a=B.size(e[1].dims),n=a%4===0,i=s=>{let u=M("x",t,[1],4),l=M("bias",t,[1],4),d=Q("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,m=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,l,d)}

    ${Na(Oe(t))}

    ${s.mainStart(Jt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${m}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Pa("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(r/Jt/4)}})}},df=e=>{e.inputs.length<2||B.size(e.inputs[1].dims)===0?Ec(e):e.compute(ju(e.inputs))}}),Fu,Gu,pf,cf,ny=q(()=>{ne(),oe(),Te(),ue(),Fu=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Gu=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=B.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(i,1,...a);let u=r[i],l=e[0].dataType===9?4:1,d=Math.ceil(B.size(s)/l),c=[{type:12,data:d},{type:6,data:u},{type:12,data:i},...ee(e[0].dims,e[1].dims,s)],h=m=>{let _=M("data",e[0].dataType,e[0].dims.length,l),y=M("inputIndices",e[1].dataType,e[1].dims.length),b=Q("output",e[0].dataType,s.length,l),x=w=>{let C=a.length,S=`var indicesIndices${w}  = ${y.type.indices}(0);`;for(let T=0;T<C;T++)S+=`${C>1?`indicesIndices${w}[${T}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${T}]`:`outputIndices${w}`};`;S+=`
          var idx${w} = ${y.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${_.type.indices};
        `;for(let T=0,k=0;T<n;T++)T===i?(S+=`${n>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = u32(idx${w});`,k+=C):(S+=`${n>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${k}]`:`outputIndices${w}`};`,k++);return S},$;if(e[0].dataType===9){let w=(C,S,T="")=>`
          let outputIndices${S} = ${b.offsetToIndices(`outputOffset + ${S}u`)};
          ${x(S)};
          let offset${S} = ${_.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${C}[${S}] = ${T}(${_.getByOffset(`index${S}`)}[component${S}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${_.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${m.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,y,b)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:h}},pf=e=>me({axis:e.axis}),cf=(e,t)=>{let r=e.inputs;Fu(r),e.compute(Gu(e.inputs,t))}}),Hu,ff,hf,sy=q(()=>{ne(),oe(),ue(),Hu=(e,t,r,a,n,i,s,u,l)=>{let d=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],c=[i];d.push(...ee(t.dims,c));let h=m=>{let _=M("indices_data",t.dataType,t.dims.length),y=Q("input_slice_offsets_data",12,1,1),b=[_,y],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${m.registerUniforms(x).declareVariables(...b)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:d}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},ff=(e,t)=>{let r=e.inputs,a=r[0].dims,n=r[0].dataType,i=r[1].dims,s=i[i.length-1],u=B.sizeToDimension(i,i.length-1),l=B.sizeFromDimension(a,t.batchDims+s),d=B.sizeToDimension(a,t.batchDims),c=B.sizeFromDimension(a,t.batchDims),h=u/d,m=new Array(s),_=l;for(let S=0;S<s;++S)m[s-1-S]=_,_*=a[t.batchDims+s-1-S];let y=Hu(e,r[1],m,t.batchDims,a,u,h,c,s),b=t.batchDims+s;if(b>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=i.slice(0,-1).concat(a.slice(b)),$=B.size(x),w=[{type:12,data:$},{type:12,data:l},...ee(r[0].dims,y.dims,x)],C=S=>{let T=M("data",r[0].dataType,r[0].dims.length),k=M("slice_offsets",12,y.dims.length),A=Q("output",r[0].dataType,x.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,k,A)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:w}),getShaderSource:C},{inputs:[r[0],y]})},hf=e=>({batchDims:e.batch_dims,cacheKey:""})}),Ku,Zu,mf,gf,oy=q(()=>{ne(),oe(),Te(),ue(),Ku=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=B.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,n=e[0],i=e[2],s=e.length===4?e[3]:void 0;if(i.dims.length!==n.dims.length||!n.dims.map((u,l)=>l===r?Math.ceil(u/a)===i.dims[l]:u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==i.dims.length||!s.dims.map((u,l)=>u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Zu=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=B.normalizeAxis(t.gatherAxis,n),s=B.normalizeAxis(t.quantizeAxis,n),u=r.slice(0);u.splice(i,1,...a);let l=B.size(u),d=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:s},{type:12,data:i},{type:12,data:t.blockSize},...ee(...e.map((_,y)=>_.dims),u)],m=_=>{let y=M("data",e[0].dataType,e[0].dims.length),b=M("inputIndices",e[1].dataType,e[1].dims.length),x=M("scales",e[2].dataType,e[2].dims.length),$=e.length>3?M("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=Q("output",d,u.length),C=[y,b,x];$&&C.push($);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(S).declareVariables(...C,w)}
        ${_.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Oe(d)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,y)=>y!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:m}},mf=(e,t)=>{let r=e.inputs;Ku(r,t),e.compute(Zu(e.inputs,t))},gf=e=>me({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Yu,Xu,yf,_f,uy=q(()=>{ne(),oe(),Te(),ue(),Yu=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Xu=(e,t)=>{let r=e[0].dims,a=e[0].dataType,n=r.length,i=e[1].dims,s=e[1].dataType,u=B.normalizeAxis(t.axis,n),l=r[u],d=i.slice(0),c=B.size(d),h=M("input",a,n),m=M("indicesInput",s,i.length),_=Q("output",a,d.length),y=[{type:12,data:c},{type:6,data:l},{type:12,data:u}];return y.push(...ee(r,i,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:y}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,m,_)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${m.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},yf=e=>me({axis:e.axis}),_f=(e,t)=>{let r=e.inputs;Yu(r),e.compute(Xu(e.inputs,t))}}),Qu,Ju,bf,wf,ly=q(()=>{ne(),oe(),ue(),Qu=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ju=(e,t)=>{let r=e[0].dims.slice(),a=e[1].dims.slice(),[n,i,s]=gp.getShapeOfGemmResult(r,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),u=[n,i];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(i/l),c=Math.ceil(n/l),h=!0,m=B.size(u),_=[{type:12,data:h?d:m},{type:12,data:n},{type:12,data:i},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(_.push(...ee(e[2].dims)),y.push("rank")),_.push(...ee(u));let b=$=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let C=t.alpha===1?"":"value *= uniforms.alpha;",S=M("a",e[0].dataType,e[0].dims),T=M("b",e[1].dataType,e[1].dims),k=S.type.value,A=null,z=[S,T];e.length===3&&(A=M("c",e[2].dataType,e[2].dims.length),z.push(A));let O=Q("output",e[0].dataType,u.length);z.push(O);let W=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(W).declareVariables(...z)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${k}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${C}
    ${A!=null?`let cOffset = ${A.broadcastedIndicesToOffset("vec2(m, n)",O)}; value += ${k}(uniforms.beta) * ${A.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let w=M("a",e[0].dataType,e[0].dims),C=M("b",e[1].dataType,e[1].dims),S=null,T=[w,C];e.length===3&&(S=M("c",e[2].dataType,e[2].dims.length),T.push(S));let k=Q("output",e[0].dataType,u.length);T.push(k);let A=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],z="",O="";t.transA&&t.transB?(O=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${C.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(O=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${C.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(O=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${C.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(O=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${C.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let W=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(A).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${C.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${k.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${O}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${z}
      }
      workgroupBarrier();
    }

    ${W}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",k)}; value += ${k.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:_}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:b}},bf=e=>{let t=e.transA,r=e.transB,a=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:a,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},wf=(e,t)=>{Qu(e.inputs),e.compute(Ju(e.inputs,t))}}),it,lt,At,zt,el,tl,rl,il,al,nl,sl,ol,vf,$f,dy=q(()=>{ne(),oe(),Te(),ue(),[it,lt,At,zt]=[0,1,2,3],el=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},tl=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,rl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,il=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,al=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,nl=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${it}] = batch;
     indices[${lt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${At}] = u32(r);
            indices[${zt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${At}] = u32(clamp(r, 0, H - 1));
          indices[${zt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${At}] = gs_reflect(r, border[1], border[3]);
          indices[${zt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,sl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${it}], indices[${lt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${it}], indices[${lt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${it}], indices[${lt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${it}], indices[${lt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${it}], indices[${lt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${it}], indices[${lt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,ol=(e,t)=>{let r=M("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=M("grid",e[1].dataType,a.length,2),i=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(i=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[it,lt,At,zt]=[0,3,1,2]);let s=Q("output",e[0].dataType,i.length),u=r.type.value,l=B.size(i),d=[{type:12,data:l},...ee(e[0].dims,a,i)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${tl}
  ${rl(u)}
  ${il(t)}
  ${al(t)}
  ${nl(r,u,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${At}]);
      let W_in = i32(uniforms.x_shape[${zt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${it}], indices[${At}], indices[${zt}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${sl(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let m=B.size(i);return{outputs:[{dims:i,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:d}},getShaderSource:c}},vf=(e,t)=>{el(e.inputs),e.compute(ol(e.inputs,t))},$f=e=>me({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),De,ul,xf,la,ll,br,Cf,Tf=q(()=>{ne(),oe(),Te(),cn(),mn(),ue(),Ct(),De=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,ul=(e,t)=>{let r=e[0],a=De(e,1),n=De(e,2),i=De(e,3),s=De(e,4),u=De(e,5),l=De(e,6),d=De(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],m=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=h,y=0,b=0,x=Math.floor(m/t.numHeads);if(l&&d&&B.size(l.dims)&&B.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=l.dims[2],b=l.dims[2]}else if(l&&B.size(l.dims)||d&&B.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(a&&B.size(a.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,_=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,_=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,_=a.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(i&&B.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=y+_,C=0;if(s&&B.size(s.dims)>0){C=8;let A=s.dims;throw A.length===1?A[0]===c?C=1:A[0]===3*c+2&&(C=3):A.length===2&&A[0]===c&&A[1]===w&&(C=5),C===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,T=m;if(n&&B.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(_!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=n.dims[2]}else{if(_!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=n.dims[1]*n.dims[3],S=!0}}let k=!1;if(s&&B.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&B.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==h||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:y,kvSequenceLength:_,totalSequenceLength:w,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:m,vHiddenSize:T,headSize:x,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:C,scale:t.scale,broadcastResPosBias:k,passPastInKv:S,qkvFormat:$}},xf=e=>me({...e}),la=me({perm:[0,2,1,3]}),ll=(e,t,r,a,n,i,s)=>{let u=[a,n,i],l=B.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:i}],c=h=>{let m=Q("qkv_with_bias",t.dataType,u),_=M("qkv",t.dataType,u),y=M("bias",r.dataType,u),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms(b).declareVariables(_,y,m)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},br=(e,t,r,a,n,i,s,u)=>{let l=i;if(s&&B.size(s.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=ll(e,i,s,t,a,r*n,u),l=l.reshape([t,a,r,n]),r===1||a===1?l:e.compute(qe(l,la.perm),{inputs:[l],outputs:[-1]})[0]}else return i.dims.length===3&&(l=i.reshape([t,a,r,n])),r===1||a===1?l:e.compute(qe(l,la.perm),{inputs:[l],outputs:[-1]})[0]},Cf=(e,t)=>{let r=ul(e.inputs,t),a=e.inputs[0],n=De(e.inputs,1),i=De(e.inputs,2),s=De(e.inputs,3),u=De(e.inputs,4),l=De(e.inputs,5),d=De(e.inputs,6),c=De(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let h=n&&i&&n.dims.length===4&&i.dims.length===4,m=br(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,s,0);if(h)return Cr(e,m,n,i,u,void 0,d,c,l,r);if(!n||!i)throw new Error("key and value must be provided");let _=br(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),y=br(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,s,2*r.hiddenSize);Cr(e,m,_,y,u,void 0,d,c,l,r)}}),dl,pl,cl,fl,Va,Sf,If,kf=q(()=>{ne(),oe(),Te(),ue(),dl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},pl=(e,t)=>{let r=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),a=r.length),me({numOutputs:a,axis:t.axis,splitSizes:r})},cl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${J("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,fl=e=>{let t=e.length,r=[];for(let a=0;a<t;++a){let n=e[a].setByIndices("indices","input[global_idx]");t===1?r.push(n):a===0?r.push(`if (output_number == ${a}u) { ${n} }`):a===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${a}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Va=(e,t)=>{let r=e[0].dims,a=B.size(r),n=e[0].dataType,i=B.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=M("input",n,r.length),l=new Array(t.numOutputs),d=[],c=[],h=0,m=[{type:12,data:a}];for(let y=0;y<t.numOutputs;y++){h+=t.splitSizes[y],l[y]=h;let b=r.slice();b[i]=t.splitSizes[y],c.push(b),s[y]=Q(`output${y}`,n,b.length),d.push({dims:c[y],dataType:e[0].dataType})}m.push({type:12,data:l},...ee(r,...c));let _=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${cl(l.length)}
  ${fl(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${J("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:m})}},Sf=(e,t)=>{dl(e.inputs);let r=e.inputs.length===1?t:pl(e.inputs,t);e.compute(Va(e.inputs,r),{inputs:[0]})},If=e=>{let t=e.axis,r=e.splitSizes,a=e.numOutputs<0?r.length:e.numOutputs;if(a!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return me({axis:t,numOutputs:a,splitSizes:r})}}),hl,ii,Ef,Af=q(()=>{ne(),oe(),Te(),ue(),hl=(e,t)=>{let[r,a,n,i]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!B.areEqual(a.dims,[])&&!B.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!B.areEqual(n.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=n.dims[0],h=B.sizeFromDimension(r.dims,1)/d,m=u===0?n.dims[1]*2:h/s;if(u>m)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(l!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(d!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(m/2!==n.dims[1]&&u/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},ii=(e,t)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:n,scale:i}=t,s=e[0].dims[0],u=B.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,c=e[2].dims[1],h=n===0?c*2:d/a,m=new Array(s,l,d/h,h-c),_=B.computeStrides(m),y=[{type:1,data:i},{type:12,data:m},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,d,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,h,l*h,1]}):[],...ee(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let $=M("input",e[0].dataType,e[0].dims.length),w=M("position_ids",e[1].dataType,e[1].dims.length),C=M("cos_cache",e[2].dataType,e[2].dims.length),S=M("sin_cache",e[3].dataType,e[3].dims.length),T=Q("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:m.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${x.declareVariables($,w,C,S,T)}

        ${x.mainStart(Jt)}
          let half_rotary_emb_dim = uniforms.${C.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",Q("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${C.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${C.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:me({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(m)/Jt)},programUniforms:y})}},Ef=(e,t)=>{hl(e.inputs,t),e.compute(ii(e.inputs,t))}}),ml,gl,da,yl,zf,py=q(()=>{Te(),ne(),mn(),Tf(),kf(),Ct(),Af(),ue(),ml=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=d,m=0,_=!a||a.dims.length===0,y=Math.floor(_?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);_&&(c=y*t.numHeads);let b=i&&i.dims.length!==0,x=s&&s.dims.length!==0;if(b&&i.dims.length===4&&i.dims[0]===l&&i.dims[1]!==t.kvNumHeads&&i.dims[2]===t.kvNumHeads&&i.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&x){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=i.dims[2]}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(a&&a.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(r.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');h=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=a.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let w=0,C=!1,S=t.kvNumHeads?y*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],C=!0}}let T=e.length>4?e[5]:void 0;if(T&&T.dims.length!==1&&T.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:S,headSize:y,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:C,qkvFormat:$}},gl=me({perm:[0,2,1,3]}),da=(e,t,r)=>{let a=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(a=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),a=e.compute(qe(a,gl.perm),{inputs:[a],outputs:[-1]})[0]),a},yl=(e,t,r,a)=>{let n=7,i=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=c=>{let h=M("seq_lens",r.dataType,r.dims),m=M("total_seq_lens",a.dataType,a.dims),_=Q("pos_ids",n,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(y).declareVariables(h,m,_)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${m.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${_.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},zf=(e,t)=>{var S;let r=ml(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((S=e.inputs[1])==null?void 0:S.dims.length)===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,i=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=me({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[m,_,y]=!n&&!i?e.compute(Va([a],h),{inputs:[a],outputs:[-1,-1,-1]}):[a,n,i],b,x;if(t.doRotary){let T=e.compute(yl(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],k=e.inputs[7],A=e.inputs[8],z=me({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),O=[m,T,k,A],W=[-1];b=e.compute(ii(O,z),{inputs:O,outputs:W})[0],O.splice(0,1,_);let V=me({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(ii(O,V),{inputs:O,outputs:W})[0]}let $=br(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?b:m,void 0,0),w=da(e,t.doRotary?x:_,r),C=da(e,y,r);Cr(e,$,w,C,void 0,void 0,s,u,void 0,r,l,d)}}),pa,_l,bl,Of,cy=q(()=>{ne(),oe(),Ct(),ue(),pa=(e,t,r,a,n,i,s,u)=>{let l=Ce(i),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,h=n*s,m=64;h===1&&(m=256);let _=[n,s,i/l],y=[n,s,2],b=["rank","type","type"],x=[];x.push(...ee(_,y));let $=w=>{let C=M("x",t.dataType,3,l),S=M("scale",r.dataType,r.dims),T=M("bias",a.dataType,a.dims),k=Q("output",1,3,2),A=[C,S,T,k];return`
  var<workgroup> workgroup_shared : array<${c}, ${m}>;
  const workgroup_size = ${m}u;
  ${w.declareVariables(...A)}
  ${w.mainStart(m)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${C.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${xt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${xt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${m}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:h},programUniforms:x}),getShaderSource:$},{inputs:[t,r,a],outputs:[-1]})[0]},_l=(e,t,r)=>{let a=t[0].dims,n=a,i=2,s=a[0],u=a[1],l=B.sizeFromDimension(a,i),d=Ce(l),c=B.size(n)/d,h=pa(e,t[0],t[1],t[2],s,l,u,r.epsilon),m=[s,u,l/d],_=[s,u],y=["type","none"],b=x=>{let $=M("x",t[0].dataType,m.length,d),w=M("scale_shift",1,_.length,2),C=Q("output",t[0].dataType,m.length,d),S=[$,w,C];return`
  ${x.registerUniform("output_size","u32").declareVariables(...S)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${C.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${C.type.value}(scale_shift.x) + ${C.type.value}(scale_shift.y);
      ${C.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...ee(m,_,m)]}),getShaderSource:b},{inputs:[t[0],h]})},bl=(e,t,r)=>{let a=t[0].dims,n=a,i=a[0],s=a[a.length-1],u=B.sizeFromDimension(a,1)/s,l=Ce(s),d=B.size(n)/l,c=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],h=["type","type"],m=!1,_=[0,a.length-1];for(let $=0;$<a.length-2;$++)m=m||a[$+1]!==1,_.push($+1);m=m&&a[a.length-1]!==1;let y=m?e.compute(qe(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},($,w)=>a[_[w]])),b=pa(e,y,t[1],t[2],i,u,s,r.epsilon),x=$=>{let w=Ee(t[0].dataType),C=l===1?"vec2f":`mat${l}x2f`,S=A=>{let z=A===0?"x":"y",O=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${w}(${O}(scale.${z}))`;case 2:return`vec2<${w}>(${O}(scale[0].${z}, scale[1].${z}))`;case 4:return`vec4<${w}>(${O}(scale[0].${z}, scale[1].${z}, scale[2].${z}, scale[3].${z}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=M("input",t[0].dataType,t[0].dims,l),k=Q("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${C}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${k.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:x},{inputs:[t[0],b]})},Of=(e,t)=>{t.format==="NHWC"?bl(e,e.inputs,t):_l(e,e.inputs,t)}}),wl,vl,Rf,fy=q(()=>{ne(),oe(),ue(),wl=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},vl=(e,t,r)=>{let a=t.simplified,n=e[0].dims,i=e[1],s=!a&&e[2],u=n,l=B.normalizeAxis(t.axis,n.length),d=B.sizeToDimension(n,l),c=B.sizeFromDimension(n,l),h=B.size(i.dims),m=s?B.size(s.dims):0;if(h!==c||s&&m!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${m}`);let _=[];for(let T=0;T<n.length;++T)T<l?_.push(n[T]):_.push(1);let y=Ce(c),b=["type","type"],x=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/y)},{type:1,data:t.epsilon}];s&&b.push("type");let $=r>1,w=r>2,C=T=>{let k=Ee(e[0].dataType),A=[M("x",e[0].dataType,e[0].dims,y),M("scale",i.dataType,i.dims,y)];s&&A.push(M("bias",s.dataType,s.dims,y)),A.push(Q("output",e[0].dataType,u,y)),$&&A.push(Q("mean_data_output",1,_)),w&&A.push(Q("inv_std_output",1,_));let z=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(z).declareVariables(...A)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Ba("f32",y)};
    var mean_square_vector = ${Ba("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Xt(k,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${xt("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${xt("mean_square_vector",y)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Xt(k,y,"x[j + offset]")};
      let f32scale = ${Xt(k,y,"scale[j]")};
      output[j + offset] = ${A[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Xt(k,y,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return $&&S.push({dims:_,dataType:1}),w&&S.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${a}`,inputDependencies:b},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:x}),getShaderSource:C}},Rf=(e,t)=>{wl(e.inputs),e.compute(vl(e.inputs,t,e.outputCount))}}),$l,Bf,hy=q(()=>{oe(),wn(),vn(),$l=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Bf=e=>{$l(e.inputs);let t=Qt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&a<8)e.compute(bn(e.inputs,{activation:""},t));else{let n=t[t.length-2],i=B.size(e.inputs[0].dims.slice(0,-2)),s=B.size(e.inputs[1].dims.slice(0,-2));if(i!==1&&n===1&&s===1){let u=e.inputs[0].reshape([1,i,a]),l=e.inputs[1].reshape([1,a,r]),d=[1,i,r],c=[u,l];e.compute(ri(c,{activation:""},t,d),{inputs:c})}else e.compute(ri(e.inputs,{activation:""},t))}}}),xl,Cl,Tl,Df,Mf,my=q(()=>{ne(),oe(),Te(),ue(),xl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],a=r.dims.length;if(r.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,s=e[1];if(!B.areEqual(s.dims,[t.n,n,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(B.size(u)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(B.size(l)!==d)throw new Error("zeroPoints input size error.")}},Cl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),l=B.size(u),d=e[1].dims[2]/4,c=e[0].dataType,h=Ce(t.k),m=Ce(d),_=Ce(s),y=u.concat([n,s]),b=n>1&&s/_%2===0?2:1,x=B.size(y)/_/b,$=64,w=[],C=[l,n,i/h],S=B.convertShape(e[1].dims).slice();S.splice(-1,1,d/m),w.push(...ee(C)),w.push(...ee(S)),w.push(...ee(e[2].dims)),e.length===4&&w.push(...ee(B.convertShape(e[3].dims)));let T=[l,n,s/_];w.push(...ee(T));let k=A=>{let z=C.length,O=M("a",e[0].dataType,z,h),W=M("b",12,S.length,m),V=M("scales",e[2].dataType,e[2].dims.length),F=[O,W,V],U=e.length===4?M("zero_points",12,e[3].dims.length):void 0;U&&F.push(U);let K=T.length,ie=Q("output",e[0].dataType,K,_),Y=Ee(e[0].dataType),se=(()=>{switch(h){case 1:return`array<${Y}, 8>`;case 2:return`mat4x2<${Y}>`;case 4:return`mat2x4<${Y}>`;default:throw new Error(`${h}-component is not supported.`)}})(),Z=()=>{let N=`
          // reuse a data
            var input_offset = ${O.indicesToOffset(`${O.type.indices}(batch, row, word_offset)`)};
            var a_data: ${se};
            for (var j: u32 = 0; j < ${8/h}; j++) {
              a_data[j] = ${O.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let G=0;G<_*b;G++)N+=`
            b_value = ${m===1?`b${G}_data`:`b${G}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${se}(${Array.from({length:4},(H,re)=>`${Y}(b_value_lower[${re}]), ${Y}(b_value_upper[${re}])`).join(", ")});
            b_dequantized_values = ${h===1?`${se}(${Array.from({length:8},(H,re)=>`(b_quantized_values[${re}] - ${U?`zero_point${G}`:"zero_point"}) * scale${G}`).join(", ")});`:`(b_quantized_values - ${se}(${Array(8).fill(`${U?`zero_point${G}`:"zero_point"}`).join(",")})) * scale${G};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(G/_)}]${_>1?`[${G%_}]`:""} += ${Array.from({length:8/h},(H,re)=>`${h===1?`a_data[${re}] * b_dequantized_values[${re}]`:`dot(a_data[${re}], b_dequantized_values[${re}])`}`).join(" + ")};
          `;return N},te=()=>{let N=`
            var col_index = col * ${_};
            ${U?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Y}(8);`}
            `;for(let G=0;G<_*b;G++)N+=`
            let scale${G} = ${V.getByOffset("col_index * nBlocksPerCol + block")};
            ${U?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${U.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${G} = ${Y}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return N},_e=()=>{let N=`col_index = col * ${_};`;for(let G=0;G<_*b;G++)N+=`
            let b${G}_data = ${W.getByIndices(`${W.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return N+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${se};
            var b_dequantized_values: ${se};`,N};return`
        var<workgroup> workgroup_shared: array<${ie.type.value}, ${b*$}>;
        ${A.declareVariables(...F,ie)}
        ${A.mainStart([$,1,1])}
          let output_indices = ${ie.offsetToIndices(`(global_idx / ${$}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${te()}
            for (var word: u32 = 0; word < ${d}; word += ${m}) {
              ${_e()}
              for (var i: u32 = 0; i < ${m}; i++) {
                ${Z()}
                word_offset += ${8/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${ie.type.value} = ${ie.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${ie.setByIndices(`${ie.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${m};${_};${b};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:c}],dispatchGroup:{x},programUniforms:w}),getShaderSource:k}},Tl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),l=B.size(u),d=e[1].dims[2]/4,c=e[0].dataType,h=Ce(t.k),m=Ce(d),_=u.concat([n,s]),y=128,b=s%8===0?8:s%4===0?4:1,x=y/b,$=x*m*8,w=$/h,C=$/t.blockSize,S=B.size(_)/b,T=[],k=[l,n,i/h],A=B.convertShape(e[1].dims).slice();A.splice(-1,1,d/m),T.push(...ee(k)),T.push(...ee(A)),T.push(...ee(e[2].dims)),e.length===4&&T.push(...ee(B.convertShape(e[3].dims)));let z=[l,n,s];T.push(...ee(z));let O=W=>{let V=k.length,F=M("a",e[0].dataType,V,h),U=M("b",12,A.length,m),K=M("scales",e[2].dataType,e[2].dims.length),ie=[F,U,K],Y=e.length===4?M("zero_points",12,e[3].dims.length):void 0;Y&&ie.push(Y);let se=z.length,Z=Q("output",e[0].dataType,se),te=Ee(e[0].dataType),_e=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${F.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${Z.type.value}, ${x}>, ${b}>;
        ${W.declareVariables(...ie,Z)}
        ${W.mainStart([x,b,1])}
          let output_indices = ${Z.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${C} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${F.getByIndices(`${F.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${F.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${C} + local_id.x;
            ${Y?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Y.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${te}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${te}(8);`}
            let scale = ${K.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${U.getByIndices(`${U.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${m}; i++) {
              ${_e()}
              let b_value = ${m===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${te}>(${Array.from({length:4},(N,G)=>`${te}(b_value_lower[${G}]), ${te}(b_value_upper[${G}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${te}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(N,G)=>`${`dot(a_data${G}, b_dequantized_values[${G}])`}`).join(" + ")};
              word_offset += ${8/h};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${Z.type.value} = ${Z.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${Z.setByIndices(`${Z.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${m};${x};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x:S},programUniforms:T}),getShaderSource:O}},Df=(e,t)=>{xl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Tl(e.inputs,t)):e.compute(Cl(e.inputs,t))},Mf=e=>me(e)}),Sl,Il,kl,El,Al,zl,Ol,Rl,Nf,gy=q(()=>{ne(),oe(),ue(),Sl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Il=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
            k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${J("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${J("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},kl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${J("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${J("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},El=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${J("uniforms.x_shape",n,t)})) {
                  k = i32(${J("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Al=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${J("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${J("uniforms.x_shape",n,t)})) {
                  k -= i32(${J("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},zl=(e,t,r)=>{switch(r.mode){case 0:return Il(e,t,r.pads.length);case 1:return kl(e,t,r.pads.length);case 2:return El(e,t,r.pads.length);case 3:return Al(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Ol=(e,t)=>{let r=B.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,n=B.size(r),i=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&i.push({type:s?e[2].dataType:1,data:t.value}),i.push(...ee(e[0].dims,r));let u=["rank"],l=d=>{let c=Q("output",e[0].dataType,r.length),h=M("x",e[0].dataType,a.length),m=h.type.value,_=zl(c,a.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?m:"f32"}),`
            ${d.registerUniforms(y).declareVariables(h,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${m}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(r)/64)},programUniforms:i}),getShaderSource:l}},Rl=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,i=new Int32Array(2*n).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)i[Number(u[l])]=Number(r[l]),i[Number(u[l])+n]=Number(r[l+u.length])}else r.forEach((u,l)=>i[Number(l)]=Number(u));let s=[];return i.forEach(u=>s.push(u)),{mode:t.mode,value:a,pads:s}}else return t},Nf=(e,t)=>{Sl(e.inputs);let r=Rl(e.inputs,t);e.compute(Ol(e.inputs,r),{inputs:[0]})}}),cr,ca,fa,ha,ma,Bl,Dl,ga,ya,Pf,Uf,_a,Wf,Lf,ba,qf,Vf,jf,Ff,yy=q(()=>{Fe(),ne(),oe(),ue(),cr=e=>{if(le.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},ca=(e,t,r)=>{let a=t.format==="NHWC",n=e.dims.slice();a&&n.splice(1,0,n.pop());let i=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=i?t.dilations.slice():[],d=t.pads.slice();ei.adjustPoolAttributes(r,n,s,u,l,d);let c=ei.computePoolOutputShape(r,n,u,l,s,d,t.autoPad),h=Object.assign({},t);i?Object.assign(h,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let m=c.slice();return m.push(m.splice(1,1)[0]),[h,a?m:c]},fa=(e,t)=>{let r=t.format==="NHWC",a=B.size(e),n=B.size(t.kernelShape),i=[{type:12,data:a},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(d+c);i.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let m=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];m=!!(b+x),i.push({type:12,data:_},{type:12,data:y},{type:12,data:b},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,s,!0,h,m]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=B.computeStrides(t.kernelShape);i.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[i,s,!!l,!1,!1]}},ha=(e,t,r,a,n,i,s,u,l,d,c,h)=>{let m=n.format==="NHWC",_=t.type.value,y=Q("output",t.type.tensor,a);if(n.kernelShape.length<=2){let b="",x="",$="",w=r-(m?2:1);if(c?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`,n.kernelShape.length===2){let C=r-(m?3:2);h?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${C}] = indices[${C}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${C}] < 0 || xIndices[${C}] >= uniforms.x_shape[${C}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${C}] = indices[${C}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${x}
              ${b}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(m)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=n.kernelShape.length,x=n.pads.length,$="";return d?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${J("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${J("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${J("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${J("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},ma=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Bl=e=>`${ma(e)};${e.countIncludePad}`,Dl=e=>`${ma(e)};${e.storageOrder};${e.dilations}`,ga=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ya=(e,t,r,a)=>{let[n,i]=ca(t,a,r),s=M("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,h,m,_,y]=fa(i,n);c.push(...ee(t.dims,i));let b=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${m};${_};${y}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(i)/64)},programUniforms:c}),getShaderSource:x=>ha(x,s,t.dims.length,i.length,n,l,d,0,h,m,_,y)}},Pf=e=>{let t=e.count_include_pad!==0,r=ga(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let a={countIncludePad:t,...r,cacheKey:""};return{...a,cacheKey:Bl(a)}},Uf=(e,t)=>{cr(e.inputs),e.compute(ya("AveragePool",e.inputs[0],!1,t))},_a={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Wf=e=>{let t=e.format;return{format:t,..._a,cacheKey:t}},Lf=(e,t)=>{cr(e.inputs),e.compute(ya("GlobalAveragePool",e.inputs[0],!0,t))},ba=(e,t,r,a)=>{let[n,i]=ca(t,a,r),s=`
      value = max(x_val, value);
    `,u="",l=M("x",t.dataType,t.dims.length),d=["rank"],[c,h,m,_,y]=fa(i,n);return c.push(...ee(t.dims,i)),{name:e,shaderCache:{hint:`${a.cacheKey};${m};${_};${y}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(i)/64)},programUniforms:c}),getShaderSource:b=>ha(b,l,t.dims.length,i.length,n,s,u,t.dataType===10?-65504:-1e5,h,m,_,y)}},qf=(e,t)=>{cr(e.inputs),e.compute(ba("MaxPool",e.inputs[0],!1,t))},Vf=e=>{let t=e.storage_order,r=e.dilations,a=ga(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...a,cacheKey:""};return{...n,cacheKey:Dl(n)}},jf=e=>{let t=e.format;return{format:t,..._a,cacheKey:t}},Ff=(e,t)=>{cr(e.inputs),e.compute(ba("GlobalMaxPool",e.inputs[0],!0,t))}}),Ml,Nl,Gf,Hf,_y=q(()=>{ne(),oe(),Te(),ue(),Ml=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,a)=>r===e[2].dims[a]).reduce((r,a)=>r&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,i)=>i===t.axis||n===e[0].dims[i]).reduce((n,i)=>n&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/a)||t.blockSize>Math.ceil(r/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Nl=(e,t)=>{let r=B.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,n=a===3,i=e[0].dims,s=e[1].dataType,u=B.size(i),l=a===3||a===2,d=l?[Math.ceil(B.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,m=h?l?[Math.ceil(B.size(h.dims)/4)]:h.dims:void 0,_=c.length===0||c.length===1&&c[0]===1,y=_===!1&&c.length===1,b=Ce(u),x=_&&(!l||b===4),$=x?b:1,w=x&&!l?b:1,C=M("input",l?12:a,d.length,w),S=M("scale",s,c.length),T=h?M("zero_point",l?12:a,m.length):void 0,k=Q("output",s,i.length,$),A=[C,S];T&&A.push(T);let z=[d,c];h&&z.push(m);let O=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...ee(...z,i)],W=V=>{let F=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${V.registerUniforms(F).declareVariables(...A,k)}
      ${V.mainStart()}
          ${V.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${k.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${C.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${C.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${S.getByOffset("0")}`:y?`
            let scale_index = ${k.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?_?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:y?l?`
                let zero_point_index = ${k.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${k.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":C.type.value}(0);`};
      // Compute and write output
      ${k.setByOffset("global_idx",`${k.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:W,getRunData:()=>({outputs:[{dims:i,dataType:s}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:O})}},Gf=(e,t)=>{Ml(e.inputs,t),e.compute(Nl(e.inputs,t))},Hf=e=>me({axis:e.axis,blockSize:e.blockSize})}),Pl,Ul,Kf,by=q(()=>{Fe(),ne(),ue(),Pl=(e,t,r)=>{let a=e===t,n=e<t&&r<0,i=e>t&&r>0;if(a||n||i)throw new Error("Range these inputs' contents are invalid.")},Ul=(e,t,r,a)=>{let n=Math.abs(Math.ceil((t-e)/r)),i=[n],s=n,u=[{type:12,data:s},{type:a,data:e},{type:a,data:r},...ee(i)],l=d=>{let c=Q("output",a,i.length),h=c.type.value,m=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${d.registerUniforms(m).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},Kf=e=>{let t=0,r=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),le.webgpu.validateInputContent&&Pl(t,r,a),e.compute(Ul(t,r,a,e.inputs[0].dataType),{inputs:[]})}}),Wl,Ll,Zf,Yf,wy=q(()=>{ne(),oe(),Te(),ue(),Wl=(e,t,r,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,i=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return a==="i32"||a==="u32"?`atomicAdd(&${t}, bitcast<${a}>(${r}));`:`
              ${n}bitcast<${a}>(oldValue) + (${r})${i}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${i}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${r}));`:`${n}min(bitcast<${a}>(oldValue), (${r}))${i}`;case"mul":return`${n}(bitcast<${a}>(oldValue) * (${r}))${i}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ll=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r,i=1,s=Math.ceil(B.sizeToDimension(a,a.length-1)/i),u=a[a.length-1],l=B.sizeFromDimension(r,u),d=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...ee(e[1].dims,e[2].dims,n)],c=h=>{let m=M("indices",e[1].dataType,e[1].dims.length),_=M("updates",e[2].dataType,e[2].dims.length,i),y=t.reduction!=="none"&&t.reduction!==""?xp("output",e[0].dataType,n.length):Q("output",e[0].dataType,n.length,i);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(m,_,y)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${Wl(t.reduction,"output[data_offset + i]","value",y.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:c}},Zf=e=>me({reduction:e.reduction}),Yf=(e,t)=>{e.compute(Ll(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),ql,Vl,jl,wa,Fl,Gl,Hl,Kl,Zl,Yl,Xl,Ql,va,Jl,ed,td,rd,id,Xf,Qf,vy=q(()=>{ne(),oe(),Te(),ue(),ql=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Vl=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(r).fill(1);return t.forEach((n,i)=>a[n]=e[i]),a},jl=(e,t,r,a,n,i)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>i.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>a.push(c)),a.length!==0&&a.length!==d&&r>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");ql(a,t),t.axes.length>0&&Vl(a,t.axes,d).forEach((c,h)=>a[h]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof n<"u"&&a.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},wa=(e,t,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,Fl=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${wa("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${wa("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Gl=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Hl=(e,t,r)=>{let a=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?a:e.slice();return t.length>0?(t.forEach((i,s)=>{a[i]=n[s],a[s+r]=n[t.length+s]}),a):n},Kl=(e,t,r,a)=>{let n=[];if(r.length>0)if(a.length>0){if(e.forEach(i=>n.push(i)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((i,s)=>n[i]=r[s])}else r.forEach(i=>n.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((i,s)=>Math.round(i*t[s]))}return n},Zl=(e,t,r)=>{let a=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=a),r.axes.forEach(i=>n[i]=Math.round(e[i]*t[i]))):(t.fill(a,0,t.length),n.forEach((i,s)=>n[s]=Math.round(i*t[s]))),n},Yl=(e,t,r,a,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${J("uniforms.scales","i",a)};
        var roi_low = ${J("uniforms.roi","i",n)};
        var roi_hi = ${J("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${J("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${J("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Xl=(e,t,r,a,n,i,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${J("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${J("uniforms.roi","i",i)};
          var roi_hi = ${J("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${J("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${J("uniforms.output_shape","i",a.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Ql=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${J("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,va=(e,t,r,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Jl=(e,t,r,a,n)=>{let[i,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${va(e,l,i,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${a?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${i}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},ed=(e,t,r,a,n,i,s,u,l,d)=>{let c=r.length===2,[h,m]=c?[0,1]:[2,3],_=e.type.value,y=b=>{let x=b===h?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${_} {
        var output_index = ${t.indicesGet("output_indices",b)};
        var originalIdx: ${_} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[b]},
        ${a[b]}, ${r[b]}, ${i[b]}, ${i[b]} + ${r.length});
        var fractOriginalIdx: ${_} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[b]} - 1))) {
          return ${l};
        }
        var data: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${_} = originalIdx + ${_}(i);
          if (${x} < 0 || ${x} >= ${r[b]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${x} = max(0, min(${x}, ${r[b]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",b,`u32(${x})`)};
          data[i + 1] = ${b===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${y(h)};
    ${y(m)};
  fn getCubicInterpolationCoefs(s: ${_}) -> array<${_}, 4> {
    var absS = abs(s);
    var coeffs: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${_} = 1.0 - absS;
    var twoMinusAbsS: ${_} = 2.0 - absS;
    var onePlusAbsS: ${_} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${_}, 4>, coefs: array<${_}, 4>) -> ${_} {
    var coefsSum: ${_} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${_} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},td=(e,t,r,a,n)=>{let[i,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${va(e,d,i,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${a?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${i}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},rd=(e,t,r,a,n,i)=>{let s=e.dims,u=Hl(i,t.axes,s.length),l=Kl(s,a,n,t.axes),d=a.slice();a.length===0&&(d=s.map((w,C)=>w===0?1:l[C]/w),t.keepAspectRatioPolicy!=="stretch"&&(l=Zl(s,d,t)));let c=Q("output",e.dataType,l.length),h=M("input",e.dataType,s.length),m=B.size(l),_=s.length===l.length&&s.every((w,C)=>w===l[C]),y=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=h.type.value,$=w=>`
      ${_?"":`
      ${Fl(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Ql(h,s)};
              ${Gl(t.nearestMode,r,x)};
              ${Xl(h,c,s,l,d.length,u.length,y)};
              `;case"linear":return`
              ${Yl(c,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Jl(h,c,s,y,b)}`;if(s.length===3||s.length===5)return`${td(h,c,s,y,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${ed(h,c,s,l,d,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(h,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:1,data:d},{type:1,data:u},...ee(s,l)]})}},id=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Xf=(e,t)=>{let r=[],a=[],n=[],i=id(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");jl(e.inputs,t,i,r,a,n),e.compute(rd(e.inputs[0],t,i,r,a,n),{inputs:[0]})},Qf=e=>{let t=e.antialias,r=e.axes,a=e.coordinateTransformMode,n=e.cubicCoeffA,i=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return me({antialias:t,axes:r,coordinateTransformMode:a,cubicCoeffA:n,excludeOutside:i,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),ad,nd,Jf,$y=q(()=>{ne(),oe(),ue(),ad=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],a=e[2];if(t.dataType!==r.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},nd=(e,t,r,a)=>{let n=t.simplified,i=e[0].dims,s=B.size(i),u=i,l=s,d=i.slice(-1)[0],c=a?i.slice(0,-1).concat(1):[],h=!n&&e.length>3,m=e.length>4,_=a&&r>1,y=a&&r>2,b=r>3,x=64,$=Ce(d),w=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],C=T=>{let k=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],A=[M("x",e[0].dataType,e[0].dims,$),M("skip",e[1].dataType,e[1].dims,$),M("gamma",e[2].dataType,e[2].dims,$)];h&&A.push(M("beta",e[3].dataType,e[3].dims,$)),m&&A.push(M("bias",e[4].dataType,e[4].dims,$)),A.push(Q("output",e[0].dataType,u,$)),_&&A.push(Q("mean_output",1,c)),y&&A.push(Q("inv_std_output",1,c)),b&&A.push(Q("input_skip_bias_sum",e[0].dataType,u,$));let z=Ee(e[0].dataType),O=Ee(1,$);return`

      ${T.registerUniforms(k).declareVariables(...A)}
      var<workgroup> sum_shared : array<${O}, ${x}>;
      var<workgroup> sum_squared_shared : array<${O}, ${x}>;

      ${T.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${m?"bias[offset1d + i]":z+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Xt(z,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${xt("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${xt("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${z}(mean)`}) *
            ${z}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:c,dataType:1}),r>2&&S.push({dims:c,dataType:1}),r>3&&S.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${_};${y};${b}`,inputDependencies:e.map((T,k)=>"type")},getShaderSource:C,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:w})}},Jf=(e,t)=>{ad(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(nd(e.inputs,t,e.outputCount,!1),{outputs:r})}}),sd,fr,od,$a,ud,ld,eh,th,xy=q(()=>{ne(),oe(),Te(),ue(),sd=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},fr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>r.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>r.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},od=(e,t)=>{if(e.length>1){let r=fr(e,1),a=fr(e,2),n=fr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),me({starts:r,ends:a,axes:n})}else return t},$a=(e,t,r,a,n)=>{let i=e;return e<0&&(i+=r[a[t]]),n[t]<0?Math.max(0,Math.min(i,r[a[t]]-1)):Math.max(0,Math.min(i,r[a[t]]))},ud=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${J("uniforms.input_shape","i",r.length)};
            let steps_i = ${J("uniforms.steps","i",r.length)};
            let signs_i = ${J("uniforms.signs","i",r.length)};
            let starts_i = ${J("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,ld=(e,t)=>{let r=e[0].dims,a=B.size(r),n=t.axes.length>0?B.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=fr(e,4);i.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(n.length).fill(1));let s=t.starts.map(($,w)=>$a($,w,r,n,i)),u=t.ends.map(($,w)=>$a($,w,r,n,i));if(n.length!==s.length||n.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(s.splice($,0,0),u.splice($,0,r[$]),i.splice($,0,1));let l=i.map($=>Math.sign($));i.forEach(($,w,C)=>{if($<0){let S=(u[w]-s[w])/$,T=s[w],k=T+S*i[w];s[w]=k,u[w]=T,C[w]=-$}});let d=r.slice(0);n.forEach(($,w)=>{d[$]=Math.ceil((u[$]-s[$])/i[$])});let c={dims:d,dataType:e[0].dataType},h=Q("output",e[0].dataType,d.length),m=M("input",e[0].dataType,e[0].dims.length),_=B.size(d),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:i.length}],b=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:i},...ee(e[0].dims,d)],x=$=>`
      ${$.registerUniforms(y).declareVariables(m,h)}
        ${ud(m,h,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",m.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:b})}},eh=(e,t)=>{sd(e.inputs,t);let r=od(e.inputs,t);e.compute(ld(e.inputs,r),{inputs:[0]})},th=e=>{let t=e.starts,r=e.ends,a=e.axes;return me({starts:t,ends:r,axes:a})}}),dd,pd,rh,ih,Cy=q(()=>{ne(),oe(),Te(),Ct(),ue(),dd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},pd=(e,t)=>{let r=e.inputs[0],a=r.dims,n=B.size(a),i=a.length,s=B.normalizeAxis(t.axis,i),u=s<a.length-1,l,d=[];u?(d=Array.from({length:i},(A,z)=>z),d[s]=i-1,d[i-1]=s,l=e.compute(qe(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,h=c[i-1],m=n/h,_=Ce(h),y=h/_,b=64;m===1&&(b=256);let x=(A,z)=>z===4?`max(max(${A}.x, ${A}.y), max(${A}.z, ${A}.w))`:z===2?`max(${A}.x, ${A}.y)`:z===3?`max(max(${A}.x, ${A}.y), ${A}.z)`:A,$=M("x",l.dataType,l.dims,_),w=Q("result",l.dataType,l.dims,_),C=$.type.value,S=Ee(l.dataType)==="f32"?`var threadMax = ${C}(-3.402823e+38f);`:`var threadMax = ${C}(-65504.0h);`,T=A=>`
      var<workgroup> rowMaxShared : ${C};
      var<workgroup> rowSumShared : ${C};
      var<workgroup> threadShared : array<${C}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${C} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${C}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${A.registerUniform("packedCols","i32").declareVariables($,w)}
      ${A.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${C}(${x("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${C}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${C}(${xt("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${C}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,k=e.compute({name:"Softmax",shaderCache:{hint:`${_};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:y}]}),getShaderSource:T},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(qe(k,d),{inputs:[k]})},rh=(e,t)=>{dd(e.inputs),pd(e,t)},ih=e=>me({axis:e.axis})}),xa,cd,fd,hd,ah,Ty=q(()=>{ne(),oe(),ue(),xa=e=>Array.from(e.getBigInt64Array(),Number),cd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(xa(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},fd=(e,t)=>{let r=[];for(let a=0;a<e.length;++a)r.push(e[a]*t[a]);return r},hd=(e,t)=>{let r=e[0].dims,a=t??xa(e[1]),n=fd(r,a),i=B.size(n),s=e[0].dataType,u=M("input",s,r.length),l=Q("output",s,n.length),d=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...ee(e[0].dims,n)]}),getShaderSource:d}},ah=e=>{cd(e.inputs),e.compute(hd(e.inputs),{inputs:[0]})}}),md,gd,nh,Sy=q(()=>{ne(),oe(),ue(),md=(e,t,r,a,n)=>{let i=Q("output_data",n,r.length,4),s=M("a_data",t[1].dataType,t[1].dims.length,4),u=M("b_data",t[2].dataType,t[2].dims.length,4),l=M("c_data",t[0].dataType,t[0].dims.length,4),d,c=(h,m,_)=>`select(${m}, ${h}, ${_})`;if(!a)d=i.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(m,_,y="")=>{let b=`a_data[index_a${_}][component_a${_}]`,x=`b_data[index_b${_}][component_b${_}]`,$=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${i.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,i)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,i)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,i)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${m}[${_}] = ${y}(${c(b,x,$)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,i)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},gd=e=>{let t=e[1].dims,r=e[2].dims,a=e[0].dims,n=e[1].dataType,i=!(B.areEqual(t,r)&&B.areEqual(r,a)),s=t,u=B.size(t);if(i){let d=Qt.calcShape(Qt.calcShape(t,r,!1),a,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=B.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>md(d,e,s,i,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...ee(a,t,r,s)]})}},nh=e=>{e.compute(gd(e.inputs))}}),sh,Iy=q(()=>{Lg(),mn(),qg(),Vg(),jg(),Fg(),Gg(),Xg(),Jg(),ey(),ty(),ry(),iy(),ay(),ny(),sy(),oy(),uy(),ly(),dy(),py(),cy(),fy(),hy(),my(),Tf(),gy(),yy(),_y(),by(),wy(),hn(),vy(),Af(),$y(),xy(),Cy(),kf(),Ty(),Ct(),gn(),Sy(),sh=new Map([["Abs",[Qp]],["Acos",[Jp]],["Acosh",[ec]],["Add",[Bc]],["ArgMax",[Kp,Ma]],["ArgMin",[Hp,Ma]],["Asin",[tc]],["Asinh",[rc]],["Atan",[ic]],["Atanh",[ac]],["Attention",[Zp]],["AveragePool",[Uf,Pf]],["BatchNormalization",[Yp]],["BiasAdd",[Xp]],["BiasSplitGelu",[Rc]],["Cast",[sc,nc]],["Ceil",[uc]],["Clip",[oc]],["Concat",[jc,Fc]],["Conv",[qa,La]],["ConvTranspose",[tf,ef]],["Cos",[lc]],["Cosh",[dc]],["CumSum",[rf,af]],["DepthToSpace",[nf,sf]],["DequantizeLinear",[Gf,Hf]],["Div",[Dc]],["Einsum",[of,uf]],["Elu",[pc,_r]],["Equal",[Mc]],["Erf",[cc]],["Exp",[fc]],["Expand",[lf]],["FastGelu",[df]],["Floor",[hc]],["FusedConv",[qa,La]],["Gather",[cf,pf]],["GatherElements",[_f,yf]],["GatherBlockQuantized",[mf,gf]],["GatherND",[ff,hf]],["Gelu",[mc]],["Gemm",[wf,bf]],["GlobalAveragePool",[Lf,Wf]],["GlobalMaxPool",[Ff,jf]],["Greater",[Wc]],["GreaterOrEqual",[qc]],["GridSample",[vf,$f]],["GroupQueryAttention",[zf]],["HardSigmoid",[xc,$c]],["InstanceNormalization",[Of]],["LayerNormalization",[Rf]],["LeakyRelu",[gc,_r]],["Less",[Lc]],["LessOrEqual",[Vc]],["Log",[zc]],["MatMul",[Bf]],["MatMulNBits",[Df,Mf]],["MaxPool",[qf,Vf]],["Mul",[Nc]],["MultiHeadAttention",[Cf,xf]],["Neg",[_c]],["Not",[yc]],["Pad",[Nf]],["Pow",[Pc]],["QuickGelu",[Oc,_r]],["Range",[Kf]],["Reciprocal",[bc]],["ReduceMin",[qp]],["ReduceMean",[Np]],["ReduceMax",[Lp]],["ReduceSum",[jp]],["ReduceProd",[Vp]],["ReduceL1",[Pp]],["ReduceL2",[Up]],["ReduceLogSum",[Gp]],["ReduceLogSumExp",[Wp]],["ReduceSumSquare",[Fp]],["Relu",[wc]],["Resize",[Xf,Qf]],["RotaryEmbedding",[Ef]],["ScatterND",[Yf,Zf]],["Sigmoid",[vc]],["Sin",[Cc]],["Sinh",[Tc]],["Slice",[eh,th]],["SkipLayerNormalization",[Jf]],["Split",[Sf,If]],["Sqrt",[Sc]],["Softmax",[rh,ih]],["Sub",[Uc]],["Tan",[Ic]],["Tanh",[kc]],["ThresholdedRelu",[Ac,_r]],["Tile",[ah]],["Transpose",[Tp,Sp]],["Where",[nh]]])}),oh,ky=q(()=>{Fe(),ct(),ue(),oh=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,a,n){Je(e.programInfo.name);let i=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});n&&u.push({binding:u.length,resource:n});let l=i.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),je(e.programInfo.name)}dispose(){}build(e,t){Je(e.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&a.push(`enable ${d.extension};`)});let n=Cp(t,this.backend.device.limits),i=e.getShaderSource(n),s=`${a.join(`
`)}
${n.additionalImplementations}
${i}`,u=r.createShaderModule({code:s,label:e.name});ce("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return je(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&a<=n)return[t,r,a];let i=t*r*a,s=Math.ceil(Math.sqrt(i));if(s>n){if(s=Math.ceil(Math.cbrt(i)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),uh={};er(uh,{WebGpuBackend:()=>lh});var yd,_d,bd,lh,Ey=q(()=>{Fe(),ne(),ct(),bp(),Ug(),Iy(),ky(),yd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let a=0;a<e.length;++a){let n=e[a].dataType;switch(t[a]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let i=e[a].dims.length;r.push(`${n};${i}`);break}case"dims":{let i=e[a].dims.join(",");r.push(`${n};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return r.join("|")},_d=(e,t,r)=>{var n,i;let a=e.name;return(n=e.shaderCache)!=null&&n.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+r+`:${yd(t,((i=e.shaderCache)==null?void 0:i.inputDependencies)??new Array(t.length).fill("dims"))}`,a},bd=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},lh=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=i=>t.features.has(i)&&r.push(i)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(a),this.adapterInfo=new bd(t.info||await t.requestAdapterInfo()),this.gpuDataManager=$p(this),this.programManager=new oh(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,dn(e.logLevel,!!e.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Je(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var a;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let i=r[n],s=i.kernelId,u=this.kernels.get(s),l=u.kernelType,d=u.kernelName,c=i.programName,h=i.inputTensorViews,m=i.outputTensorViews,_=t[n*2],y=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=_);let b=Number(_-this.queryTimeBase),x=Number(y-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((a=this.env.webgpu.profiling)!=null&&a.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:h.map($=>({dims:$.dims,dataType:pt($.dataType)})),outputsMetadata:m.map($=>({dims:$.dims,dataType:pt($.dataType)})),kernelId:s,kernelType:l,kernelName:d,programName:c,startTime:b,endTime:x});else{let $="";h.forEach((C,S)=>{$+=`input[${S}]: [${C.dims}] | ${pt(C.dataType)}, `});let w="";m.forEach((C,S)=>{w+=`output[${S}]: [${C.dims}] | ${pt(C.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${d}|${c}" ${$}${w}start time: ${b} ns, execution time: ${x-b} ns`)}xr("GPU",`${c}::${_}::${y}`)}e.unmap(),this.pendingQueries.delete(e)}),je()}run(e,t,r,a,n,i){Je(e.name);let s=[];for(let w=0;w<t.length;++w){let C=t[w].data;if(C===0)continue;let S=this.gpuDataManager.get(C);if(!S)throw new Error(`no GPU data for input: ${C}`);s.push(S)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?u.map((w,C)=>C):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let h=[],m=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=i)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let C=c[w]===-1,S=c[w]===-2,T=C||S?n(u[w].dataType,u[w].dims):a(c[w],u[w].dataType,u[w].dims);if(h.push(T),T.data===0)continue;let k=this.gpuDataManager.get(T.data);if(!k)throw new Error(`no GPU data for output: ${T.data}`);if(C&&this.temporaryData.push(k),S){let A=this.kernelPersistentData.get(this.currentKernelId);A||(A=[],this.kernelPersistentData.set(this.currentKernelId,A)),A.push(k)}m.push(k)}if(s.length!==t.length||m.length!==h.length){if(m.length===0)return je(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(d){let w=0,C=[];d.forEach(A=>{let z=typeof A.data=="number"?[A.data]:A.data;if(z.length===0)return;let O=A.type===10?2:4,W,V;A.type===10?(V=z.length>4?16:z.length>2?8:z.length*O,W=z.length>4?16:O*z.length):(V=z.length<=2?z.length*O:16,W=16),w=Math.ceil(w/V)*V,C.push(w);let F=A.type===10?8:4;w+=z.length>4?Math.ceil(z.length/F)*W:z.length*O});let S=16;w=Math.ceil(w/S)*S;let T=new ArrayBuffer(w);d.forEach((A,z)=>{let O=C[z],W=typeof A.data=="number"?[A.data]:A.data;if(A.type===6)new Int32Array(T,O,W.length).set(W);else if(A.type===12)new Uint32Array(T,O,W.length).set(W);else if(A.type===10)new Uint16Array(T,O,W.length).set(W);else if(A.type===1)new Float32Array(T,O,W.length).set(W);else throw new Error(`Unsupported uniform type: ${pt(A.type)}`)});let k=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(k.buffer,0,T,0,w),this.gpuDataManager.release(k.id),_={offset:0,size:w,buffer:k.buffer}}let y=this.programManager.normalizeDispatchGroupSize(l),b=y[1]===1&&y[2]===1,x=_d(e,t,b),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,y),this.programManager.setArtifact(x,$),ce("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let w=0;w<d.length;w++){let C=d[w],S=C.type,T=typeof C.data=="number"?1:C.data.length,[k,A]=$.uniformVariablesInfo[w];if(S!==k||T!==A)throw new Error(`Uniform variable ${w} mismatch: expect type ${k} with size ${A}, got type ${S} with size ${T} in program "${$.programInfo.name}".`)}}if(ce("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run($,s,m,y,_),je(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,a){let n=sh.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let i={kernelType:e,kernelName:a,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,i)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let n=a.kernelType,i=a.kernelName,s=a.kernelEntry,u=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${i}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),ce("info",()=>`[WebGPU] Start to run kernel "[${n}] ${i}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${i}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${i}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,a){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let i=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,a,i);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let a=await Ra(this,e,t);return pn(a.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ce("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ce("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ce("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let a=0;a<r;a++){let n=this.getComputePassEncoder(),i=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),dh={};er(dh,{init:()=>ph});var Fr,wd,ph,Ay=q(()=>{ne(),ct(),oe(),Pg(),Fr=class ch{constructor(t,r,a,n){this.module=t,this.dataType=r,this.data=a,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(B.size(t)!==B.size(this.dims))throw new Error("Invalid new shape");return new ch(this.module,this.dataType,this.data,t)}},wd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let a=e.PTR_SIZE,n=r/e.PTR_SIZE,i=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*n++,i));let s=Number(e.getValue(a*n++,i));this.outputCount=Number(e.getValue(a*n++,i)),this.customDataOffset=Number(e.getValue(a*n++,"*")),this.customDataSize=Number(e.getValue(a*n++,i));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(a*n++,i)),c=Number(e.getValue(a*n++,"*")),h=Number(e.getValue(a*n++,i)),m=[];for(let _=0;_<h;_++)m.push(Number(e.getValue(a*n++,i)));u.push(new Fr(e,d,c,m))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,a=(t==null?void 0:t.outputs)??[],n=(u,l,d)=>new Fr(this.module,l,this.output(u,d),d),i=(u,l)=>{let d=Mt(u,l);if(!d)throw new Error(`Unsupported data type: ${u}`);let c=d>0?this.backend.gpuDataManager.create(d).id:0;return new Fr(this.module,u,c,l)};return this.backend.run(e,r,a,n,i,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let a=this.module.PTR_SIZE,n=a===4?"i32":"i64",i=this.module.stackAlloc((1+t.length)*a);this.module.setValue(i,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(i+a*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(r)}}},ph=async(e,t,r,a)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=(Ey(),$r(uh)).WebGpuBackend,s=new i;await s.initialize(r,a),n("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,c=!1)=>{if(c)ce("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{ce("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let h=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),h)}},async(u,l,d)=>{ce("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,c)=>{ce("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let h=new wd(t,s,Number(l));return s.computeKernel(Number(u),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let i=new vp(r);n("webnn",[i,()=>i.reserveTensorId(),s=>i.releaseTensorId(s),async(s,u,l,d,c)=>i.ensureTensor(s,u,l,d,c),(s,u)=>{i.uploadTensor(s,u)},async(s,u)=>i.downloadTensor(s,u),(s,u)=>i.registerMLContext(s,u),!!r.trace])}}}),vd,$n,xn,bt,$d,Ca,ai,Cn,Tn,Ta,Sn,In,kn,fh=q(()=>{Fe(),Dg(),Mg(),ne(),qt(),sn(),mp(),vd=(e,t)=>{we()._OrtInit(e,t)!==0&&ye("Can't initialize onnxruntime.")},$n=async e=>{vd(e.wasm.numThreads,Jr(e.logLevel))},xn=async(e,t)=>{var a,n;(n=(a=we()).asyncInit)==null||n.call(a);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(Ay(),$r(dh)).init;t==="webgpu"&&await i("webgpu",we(),e,r),t==="webnn"&&await i("webnn",we(),e)}},bt=new Map,$d=e=>{let t=we(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,n,n+a)!==0&&ye("Can't get session input/output count.");let i=a===4?"i32":"i64";return[Number(t.getValue(n,i)),Number(t.getValue(n+a,i))]}finally{t.stackRestore(r)}},Ca=(e,t)=>{let r=we(),a=r.stackSave(),n=0;try{let i=r.PTR_SIZE,s=r.stackAlloc(2*i);r._OrtGetInputOutputMetadata(e,t,s,s+i)!==0&&ye("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));n=Number(r.getValue(s+i,"*"));let l=r.HEAP32[n/4];if(l===0)return[u,0];let d=r.HEAPU32[n/4+1],c=[];for(let h=0;h<d;h++){let m=Number(r.getValue(n+8+h*i,"*"));c.push(m!==0?r.UTF8ToString(m):Number(r.getValue(n+8+(h+d)*i,"*")))}return[u,l,c]}finally{r.stackRestore(a),n!==0&&r._OrtFree(n)}},ai=e=>{let t=we(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Cn=async(e,t)=>{var h,m,_,y;let r,a,n=we();Array.isArray(e)?[r,a]=e:e.buffer===n.HEAPU8.buffer?[r,a]=[e.byteOffset,e.byteLength]:[r,a]=ai(e);let i=0,s=0,u=0,l=[],d=[],c=[];try{if([s,l]=await hp(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let z=[];for(let O of t.externalData){let W=typeof O=="string"?O:O.path;z.push(ln(typeof O=="string"?O:O.data).then(V=>{n.mountExternalData(W,V)}))}await Promise.all(z)}for(let z of(t==null?void 0:t.executionProviders)??[])if((typeof z=="string"?z:z.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof z!="string"){let O=z,W=O==null?void 0:O.context,V=O==null?void 0:O.gpuDevice,F=O==null?void 0:O.deviceType,U=O==null?void 0:O.powerPreference;W?n.currentContext=W:V?n.currentContext=await n.webnnCreateMLContext(V):n.currentContext=await n.webnnCreateMLContext({deviceType:F,powerPreference:U})}else n.currentContext=await n.webnnCreateMLContext();break}i=await n._OrtCreateSession(r,a,s),(h=n.webgpuOnCreateSession)==null||h.call(n,i),i===0&&ye("Can't create a session."),(m=n.jsepOnCreateSession)==null||m.call(n),n.currentContext&&(n.webnnRegisterMLContext(i,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[b,x]=$d(i),$=!!(t!=null&&t.enableGraphCapture),w=[],C=[],S=[],T=[],k=[];for(let z=0;z<b;z++){let[O,W,V]=Ca(i,z);O===0&&ye("Can't get an input name."),d.push(O);let F=n.UTF8ToString(O);w.push(F),S.push(W===0?{name:F,isTensor:!1}:{name:F,isTensor:!0,type:pt(W),shape:V})}for(let z=0;z<x;z++){let[O,W,V]=Ca(i,z+b);O===0&&ye("Can't get an output name."),c.push(O);let F=n.UTF8ToString(O);C.push(F),T.push(W===0?{name:F,isTensor:!1}:{name:F,isTensor:!0,type:pt(W),shape:V});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){k.push("gpu-buffer");continue}let U=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((_=t==null?void 0:t.preferredOutputLocation)==null?void 0:_[F])??"cpu",K=n.webnnIsGraphOutput;if(U==="cpu"&&K&&K(i,F)){k.push("ml-tensor-cpu-output");continue}if(U!=="cpu"&&U!=="cpu-pinned"&&U!=="gpu-buffer"&&U!=="ml-tensor")throw new Error(`Not supported preferred output location: ${U}.`);if($&&U!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${U}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);k.push(U)}}let A=null;return k.some(z=>z==="gpu-buffer"||z==="ml-tensor"||z==="ml-tensor-cpu-output")&&(u=n._OrtCreateBinding(i),u===0&&ye("Can't create IO binding."),A={handle:u,outputPreferredLocations:k,outputPreferredLocationsEncoded:k.map(z=>z==="ml-tensor-cpu-output"?"ml-tensor":z).map(z=>za(z))}),bt.set(i,[i,d,c,A,$,!1]),[i,w,C,S,T]}catch(b){throw d.forEach(x=>n._OrtFree(x)),c.forEach(x=>n._OrtFree(x)),u!==0&&n._OrtReleaseBinding(u)!==0&&ye("Can't release IO binding."),i!==0&&n._OrtReleaseSession(i)!==0&&ye("Can't release session."),b}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&ye("Can't release session options."),l.forEach(b=>n._free(b)),(y=n.unmountExternalData)==null||y.call(n)}},Tn=e=>{var l,d,c;let t=we(),r=bt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,n,i,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&ye("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&ye("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(c=t.webgpuOnReleaseSession)==null||c.call(t,e),n.forEach(h=>t._OrtFree(h)),i.forEach(h=>t._OrtFree(h)),t._OrtReleaseSession(a)!==0&&ye("Can't release session."),bt.delete(e)},Ta=async(e,t,r,a,n,i,s=!1)=>{if(!e){t.push(0);return}let u=we(),l=u.PTR_SIZE,d=e[0],c=e[1],h=e[3],m=h,_,y;if(d==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let $=e[2].gpuBuffer;y=Mt(Dt(d),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=w(a,i,$,y)}}else if(h==="ml-tensor"){let $=e[2].mlTensor;y=Mt(Dt(d),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=w(a,$,Dt(d),c)}else{let $=e[2];if(Array.isArray($)){y=l*$.length,_=u._malloc(y),r.push(_);for(let w=0;w<$.length;w++){if(typeof $[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(_+w*l,Xe($[w],r),"*")}}else{let w=u.webnnIsGraphInput,C=u.webnnIsGraphOutput;if(d!=="string"&&w&&C){let S=u.UTF8ToString(n);if(w(a,S)||C(a,S)){let T=Dt(d);y=Mt(T,c),m="ml-tensor";let k=u.webnnCreateTemporaryTensor,A=u.webnnUploadTensor;if(!k||!A)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await k(a,T,c);A(z,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),_=z}else y=$.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,y),_)}else y=$.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,y),_)}}let b=u.stackSave(),x=u.stackAlloc(4*c.length);try{c.forEach((w,C)=>u.setValue(x+C*l,w,l===4?"i32":"i64"));let $=u._OrtCreateTensor(Dt(d),_,y,x,c.length,za(m));$===0&&ye(`Can't create tensor for input/output. session=${a}, index=${i}.`),t.push($)}finally{u.stackRestore(b)}},Sn=async(e,t,r,a,n,i)=>{var V,F,U,K;let s=we(),u=s.PTR_SIZE,l=bt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],h=l[2],m=l[3],_=l[4],y=l[5],b=t.length,x=a.length,$=0,w=[],C=[],S=[],T=[],k=s.stackSave(),A=s.stackAlloc(b*u),z=s.stackAlloc(b*u),O=s.stackAlloc(x*u),W=s.stackAlloc(x*u);try{[$,w]=fp(i),vt("wasm prepareInputOutputTensor");for(let Z=0;Z<b;Z++)await Ta(r[Z],C,T,e,c[t[Z]],t[Z],_);for(let Z=0;Z<x;Z++)await Ta(n[Z],S,T,e,h[a[Z]],b+a[Z],_);$t("wasm prepareInputOutputTensor");for(let Z=0;Z<b;Z++)s.setValue(A+Z*u,C[Z],"*"),s.setValue(z+Z*u,c[t[Z]],"*");for(let Z=0;Z<x;Z++)s.setValue(O+Z*u,S[Z],"*"),s.setValue(W+Z*u,h[a[Z]],"*");if(m&&!y){let{handle:Z,outputPreferredLocations:te,outputPreferredLocationsEncoded:_e}=m;if(c.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${c.length}).`);vt("wasm bindInputsOutputs");for(let N=0;N<b;N++){let G=t[N];await s._OrtBindInput(Z,c[G],C[N])!==0&&ye(`Can't bind input[${N}] for session=${e}.`)}for(let N=0;N<x;N++){let G=a[N];(V=n[N])!=null&&V[3]?s._OrtBindOutput(Z,h[G],S[N],0)!==0&&ye(`Can't bind pre-allocated output[${N}] for session=${e}.`):s._OrtBindOutput(Z,h[G],0,_e[G])!==0&&ye(`Can't bind output[${N}] to ${te[N]} for session=${e}.`)}$t("wasm bindInputsOutputs"),bt.set(e,[d,c,h,m,_,!0])}(F=s.jsepOnRunStart)==null||F.call(s,d),(U=s.webnnOnRunStart)==null||U.call(s,d);let ie;m?ie=await s._OrtRunWithBinding(d,m.handle,x,O,$):ie=await s._OrtRun(d,z,A,b,W,x,O,$),ie!==0&&ye("failed to call OrtRun().");let Y=[],se=[];vt("wasm ProcessOutputTensor");for(let Z=0;Z<x;Z++){let te=Number(s.getValue(O+Z*u,"*"));if(te===S[Z]){Y.push(n[Z]);continue}let _e=s.stackSave(),N=s.stackAlloc(4*u),G=!1,H,re=0;try{s._OrtGetTensorData(te,N,N+u,N+2*u,N+3*u)!==0&&ye(`Can't access output tensor data on index ${Z}.`);let Ie=u===4?"i32":"i64",et=Number(s.getValue(N,Ie));re=s.getValue(N+u,"*");let L=s.getValue(N+u*2,"*"),be=Number(s.getValue(N+u*3,Ie)),Ne=[];for(let ge=0;ge<be;ge++)Ne.push(Number(s.getValue(L+ge*u,Ie)));s._OrtFree(L)!==0&&ye("Can't free memory for tensor dims.");let Re=Ne.reduce((ge,xe)=>ge*xe,1);H=pt(et);let at=m==null?void 0:m.outputPreferredLocations[a[Z]];if(H==="string"){if(at==="gpu-buffer"||at==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ge=[];for(let xe=0;xe<Re;xe++){let Pe=s.getValue(re+xe*u,"*"),Tt=s.getValue(re+(xe+1)*u,"*"),St=xe===Re-1?void 0:Tt-Pe;ge.push(s.UTF8ToString(Pe,St))}Y.push([H,Ne,ge,"cpu"])}else if(at==="gpu-buffer"&&Re>0){let ge=s.jsepGetBuffer;if(!ge)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let xe=ge(re),Pe=Mt(et,Re);if(Pe===void 0||!on(H))throw new Error(`Unsupported data type: ${H}`);G=!0,Y.push([H,Ne,{gpuBuffer:xe,download:s.jsepCreateDownloader(xe,Pe,H),dispose:()=>{s._OrtReleaseTensor(te)!==0&&ye("Can't release tensor.")}},"gpu-buffer"])}else if(at==="ml-tensor"&&Re>0){let ge=s.webnnEnsureTensor,xe=s.webnnIsGraphInputOutputTypeSupported;if(!ge||!xe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Mt(et,Re)===void 0||!un(H))throw new Error(`Unsupported data type: ${H}`);if(!xe(e,H,!1))throw new Error(`preferredLocation "ml-tensor" for ${H} output is not supported by current WebNN Context.`);let Pe=await ge(e,re,et,Ne,!1);G=!0,Y.push([H,Ne,{mlTensor:Pe,download:s.webnnCreateMLTensorDownloader(re,H),dispose:()=>{s.webnnReleaseTensorId(re),s._OrtReleaseTensor(te)}},"ml-tensor"])}else if(at==="ml-tensor-cpu-output"&&Re>0){let ge=s.webnnCreateMLTensorDownloader(re,H)(),xe=Y.length;G=!0,se.push((async()=>{let Pe=[xe,await ge];return s.webnnReleaseTensorId(re),s._OrtReleaseTensor(te),Pe})()),Y.push([H,Ne,[],"cpu"])}else{let ge=si(H),xe=new ge(Re);new Uint8Array(xe.buffer,xe.byteOffset,xe.byteLength).set(s.HEAPU8.subarray(re,re+xe.byteLength)),Y.push([H,Ne,xe,"cpu"])}}finally{s.stackRestore(_e),H==="string"&&re&&s._free(re),G||s._OrtReleaseTensor(te)}}m&&!_&&(s._OrtClearBoundOutputs(m.handle)!==0&&ye("Can't clear bound outputs."),bt.set(e,[d,c,h,m,_,!1]));for(let[Z,te]of await Promise.all(se))Y[Z][2]=te;return $t("wasm ProcessOutputTensor"),Y}finally{(K=s.webnnOnRunEnd)==null||K.call(s,d),s.stackRestore(k),C.forEach(ie=>s._OrtReleaseTensor(ie)),S.forEach(ie=>s._OrtReleaseTensor(ie)),T.forEach(ie=>s._free(ie)),$!==0&&s._OrtReleaseRunOptions($),w.forEach(ie=>s._free(ie))}},In=e=>{let t=we(),r=bt.get(e);if(!r)throw new Error("invalid session id");let a=r[0],n=t._OrtEndProfiling(a);n===0&&ye("Can't get an profile file name."),t._OrtFree(n)},kn=e=>{let t=[];for(let r of e){let a=r[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),wt,Me,Ft,hr,mr,Gr,Sa,Hr,Ot,Rt,xd,hh,mh,gh,yh,_h,bh,wh,vh=q(()=>{Fe(),fh(),qt(),an(),wt=()=>!!le.wasm.proxy&&typeof document<"u",Ft=!1,hr=!1,mr=!1,Hr=new Map,Ot=(e,t)=>{let r=Hr.get(e);r?r.push(t):Hr.set(e,[t])},Rt=()=>{if(Ft||!hr||mr||!Me)throw new Error("worker not ready")},xd=e=>{switch(e.data.type){case"init-wasm":Ft=!1,e.data.err?(mr=!0,Sa[1](e.data.err)):(hr=!0,Sa[0]()),Gr&&(URL.revokeObjectURL(Gr),Gr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Hr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},hh=async()=>{if(!hr){if(Ft)throw new Error("multiple calls to 'initWasm()' detected.");if(mr)throw new Error("previous call to 'initWasm()' failed.");if(Ft=!0,wt())return new Promise((e,t)=>{Me==null||Me.terminate(),pp().then(([r,a])=>{try{Me=a,Me.onerror=i=>t(i),Me.onmessage=xd,Sa=[e,t];let n={type:"init-wasm",in:le};!n.in.wasm.wasmPaths&&(r||Aa)&&(n.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep-BGTZ4Y7F.wasm",import.meta.url).href}),Me.postMessage(n),Gr=r}catch(n){t(n)}},t)});try{await nn(le.wasm),await $n(le),hr=!0}catch(e){throw mr=!0,e}finally{Ft=!1}}},mh=async e=>{if(wt())return Rt(),new Promise((t,r)=>{Ot("init-ep",[t,r]);let a={type:"init-ep",in:{epName:e,env:le}};Me.postMessage(a)});await xn(le,e)},gh=async e=>wt()?(Rt(),new Promise((t,r)=>{Ot("copy-from",[t,r]);let a={type:"copy-from",in:{buffer:e}};Me.postMessage(a,[e.buffer])})):ai(e),yh=async(e,t)=>{if(wt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Rt(),new Promise((r,a)=>{Ot("create",[r,a]);let n={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Me.postMessage(n,i)})}else return Cn(e,t)},_h=async e=>{if(wt())return Rt(),new Promise((t,r)=>{Ot("release",[t,r]);let a={type:"release",in:e};Me.postMessage(a)});Tn(e)},bh=async(e,t,r,a,n,i)=>{if(wt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Rt(),new Promise((s,u)=>{Ot("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:a,options:i}};Me.postMessage(d,kn(l))})}else return Sn(e,t,r,a,n,i)},wh=async e=>{if(wt())return Rt(),new Promise((t,r)=>{Ot("end-profiling",[t,r]);let a={type:"end-profiling",in:e};Me.postMessage(a)});In(e)}}),Ia,Cd,$h,zy=q(()=>{Fe(),vh(),ne(),rn(),mp(),Ia=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Cd=e=>{switch(e[3]){case"cpu":return new Qe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!on(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:n}=e[2];return Qe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:a,dispose:n})}case"ml-tensor":{let t=e[0];if(!un(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:n}=e[2];return Qe.fromMLTensor(r,{dataType:t,dims:e[1],download:a,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},$h=class{async fetchModelAndCopyToWasmMemory(e){return gh(await ln(e))}async loadModel(e,t){Je();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await yh(r,t),je()}async dispose(){return _h(this.sessionId)}async run(e,t,r){Je();let a=[],n=[];Object.entries(e).forEach(h=>{let m=h[0],_=h[1],y=this.inputNames.indexOf(m);if(y===-1)throw new Error(`invalid input '${m}'`);a.push(_),n.push(y)});let i=[],s=[];Object.entries(t).forEach(h=>{let m=h[0],_=h[1],y=this.outputNames.indexOf(m);if(y===-1)throw new Error(`invalid output '${m}'`);i.push(_),s.push(y)});let u=a.map((h,m)=>Ia(h,()=>`input "${this.inputNames[n[m]]}"`)),l=i.map((h,m)=>h?Ia(h,()=>`output "${this.outputNames[s[m]]}"`):null),d=await bh(this.sessionId,n,u,s,l,r),c={};for(let h=0;h<d.length;h++)c[this.outputNames[s[h]]]=i[h]??Cd(d[h]);return je(),c}startProfiling(){}endProfiling(){wh(this.sessionId)}}}),xh={};er(xh,{OnnxruntimeWebAssemblyBackend:()=>Fa,initializeFlags:()=>ja,wasmBackend:()=>Ch});var ja,Fa,Ch,Oy=q(()=>{Fe(),vh(),zy(),ja=()=>{(typeof le.wasm.initTimeout!="number"||le.wasm.initTimeout<0)&&(le.wasm.initTimeout=0);let e=le.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),le.wasm.simd=!1),typeof le.wasm.proxy!="boolean"&&(le.wasm.proxy=!1),typeof le.wasm.trace!="boolean"&&(le.wasm.trace=!1),typeof le.wasm.numThreads!="number"||!Number.isInteger(le.wasm.numThreads)||le.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)le.wasm.numThreads=1;else{let t=typeof navigator>"u"?_g("node:os").cpus().length:navigator.hardwareConcurrency;le.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Fa=class{async init(e){ja(),await hh(),await mh(e)}async createInferenceSessionHandler(e,t){let r=new $h;return await r.loadModel(e,t),r}},Ch=new Fa});Fe();Fe();Fe();var Ry="1.23.2",By=np;{let e=(Oy(),$r(xh)).wasmBackend;Pt("webgpu",e,5),Pt("webnn",e,5),Pt("cpu",e,10),Pt("wasm",e,10)}Object.defineProperty(le.versions,"web",{value:Ry,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var En=Object.freeze({__proto__:null,get InferenceSession(){return tn},get TRACE(){return xr},get TRACE_EVENT_BEGIN(){return vt},get TRACE_EVENT_END(){return $t},get TRACE_FUNC_BEGIN(){return Je},get TRACE_FUNC_END(){return je},get Tensor(){return Qe},default:By,get env(){return le},get registerBackend(){return Pt}});let Td="https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main",Dy="https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main",My={detection:`${Td}/detection/ort/PP-OCRv6_tiny_det.ort`,recognition:`${Td}/recognition/ort/PP-OCRv6_tiny_rec.ort`,charactersDictionary:`${Dy}/recognition/ppocrv6_tiny_dict.txt`},Ny=My,Gt=Ny,An={verbose:!1,debug:!1,debugFolder:"out"},Th={mean:[.485,.456,.406],stdDeviation:[.229,.224,.225],maxSideLength:"auto",minimumAreaThreshold:20,paddingVertical:.4,paddingHorizontal:.6},Sh={imageHeight:48,strategy:"per-line",crossLineWidthFactor:1,minimumConfidence:.5,charactersDictionary:[]},Py={executionProviders:["cpu"],graphOptimizationLevel:"all",enableCpuMemArena:!0,enableMemPattern:!0,executionMode:"sequential",interOpNumThreads:0,intraOpNumThreads:0},Ih="opencv",Uy={engine:Ih},ka={model:{},detection:Th,recognition:Sh,debugging:An,session:Py,processing:Uy};function Ga(e,...t){if(!t.length)return e;let r=t.shift();if(Kr(e)&&Kr(r)){for(let a in r)if(Object.prototype.hasOwnProperty.call(r,a)){if(a==="__proto__"||a==="constructor"||a==="prototype")continue;let n=r[a],i=e[a];Kr(n)?((!i||!Kr(i))&&(e[a]={}),Ga(e[a],n)):n!==void 0&&(e[a]=n)}}return Ga(e,...t)}async function Wy(e,t={}){const{timeoutMs:r=3e5,retries:a=2}=t;let n;for(let i=0;i<=a;i++)try{let s=await fetch(e,{signal:AbortSignal.timeout(r)});if(!s.ok)throw new Error(`HTTP ${s.status} ${s.statusText}`);return await s.arrayBuffer()}catch(s){n=s,i<a&&await new Promise(u=>setTimeout(u,500*(i+1)))}throw new Error(`Failed to fetch ${e} after ${a+1} attempt(s): ${String(n)}`)}function Ha(e){return(typeof e=="string"?e:new TextDecoder("utf-8").decode(e)).split(/\r?\n/)}function Kr(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)&&!(e instanceof Date)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!ArrayBuffer.isView(e)}function Ly(e,t){return e!=="auto"?e:Math.min(1920,Math.max(960,Math.round(t*.75/32)*32))}function qy(e,t,r){let a=e,n=t,i=1;return Math.max(n,a)>r&&(i=r/(n>a?n:a),a=Math.round(a*i),n=Math.round(n*i)),{width:a,height:n,ratio:i}}function Vy(e,t,r,a,n){let i=Math.round(e.height*a),s=Math.round(e.height*n),u=e.x-s,l=e.y-i;u=Math.max(0,u),l=Math.max(0,l);let d=Math.min(t,e.x+e.width+s),c=Math.min(r,e.y+e.height+i),h=d-u,m=c-l;return{x:u,y:l,width:h,height:m}}function jy(e,t,r,a){let n=e.x/t,i=e.y/t,s=e.width/t,u=e.height/t,l=Math.max(0,Math.round(n)),d=Math.max(0,Math.round(i)),c=Math.min(r-l,Math.round(s)),h=Math.min(a-d,Math.round(u));return{x:l,y:d,width:c,height:h}}function Fy(e,t,r,a,n,i,s,u,l){let d=[];return e.iterate(c=>{let h=e.getRect(c);if(h.width*h.height<=s)return;let m=Vy(h,t,r,u,l),_=jy(m,a,n,i);_.width>5&&_.height>5&&d.push(_)}),d}function Gy(e,t,r){let a=[];for(let n of e){const{bbox:i}=n;let s={x:Math.max(0,i.x0),y:Math.max(0,i.y0),width:i.x1-i.x0,height:i.y1-i.y0};s.x+s.width>t&&(s.width=t-s.x),s.y+s.height>r&&(s.height=r-s.y),s.width>5&&s.height>5&&a.push(s)}return a}let Hy=3;function Ky(e,t,r,a,n){let u=e.getContext("2d").getImageData(0,0,t,r).data,l=r*t,d=new Float32Array(Hy*l),c=a[0]??.485,h=a[1]??.456,m=a[2]??.406,_=n[0]??.229,y=n[1]??.224,b=n[2]??.225,x=1/(255*_),$=1/(255*y),w=1/(255*b),C=c/_,S=h/y,T=m/b,k=l,A=l*2;for(let z=0,O=0;z<l;z++,O+=4){let W=u[O],V=u[O+1],F=u[O+2];d[z]=W*x-C,d[k+z]=V*$-S,d[A+z]=F*w-T}return d}function Zy(e,t,r,a){let n=a(t,r),i=n.getContext("2d"),s=i.createImageData(t,r),u=s.data,l=t*r;for(let d=0;d<l;d++){let c=e[d]||0,h=Math.round(c*255),m=d*4;u[m]=h,u[m+1]=h,u[m+2]=h,u[m+3]=255}return i.putImageData(s,0,0),n}class kh{constructor(t,r,a={},n={},i="opencv"){ve(this,"options");ve(this,"debugging");ve(this,"session");ve(this,"platform");ve(this,"engine");ve(this,"lastDetectionCanvas",null);this.platform=t,this.session=r,this.options={...Th,...a},this.debugging={...An,...n},i==="opencv"&&!this.platform.imageProcessor?this.engine="canvas-native":this.engine=i}log(t){this.debugging.verbose&&console.log(`[DetectionService] ${t}`)}async run(t){this.log("Starting text detection process");try{let r;this.platform.isCanvas(t)?r=t:this.engine==="opencv"&&this.platform.imageProcessor?r=await this.platform.imageProcessor.prepareCanvas(t):r=await this.platform.canvas.prepareCanvas(t);let a=await this.preprocessDetection(r),n=await this.runInference(a.tensor,a.width,a.height);if(!n)return console.error("Text detection failed (output tensor is null)"),[];let i=this.postprocessDetection(n,a);return this.debugging.debug&&this.debugging.debugFolder&&this.lastDetectionCanvas&&(await this.debugDetectionCanvas(this.lastDetectionCanvas,a.width,a.height),await this.debugDetectedBoxes(r,i)),this.log(`Detected ${i.length} text boxes in image`),i}catch(r){return console.error("Error during text detection:",r instanceof Error?r.message:String(r)),[]}}async preprocessDetection(t){const{width:r,height:a}=t;let n=Ly(this.options.maxSideLength??"auto",Math.max(r,a));const{width:i,height:s,ratio:u}=qy(r,a,n);let l=Math.ceil(i/32)*32,d=Math.ceil(s/32)*32,c=this.platform.createCanvas(l,d);c.getContext("2d").drawImage(t,0,0,r,a,0,0,i,s);let m=this.options.mean??[.485,.456,.406],_=this.options.stdDeviation??[.229,.224,.225],y=Ky(c,l,d,m,_);return this.log(`Detection preprocessed: original(${r}x${a}), model_input(${l}x${d}), resize_ratio: ${u.toFixed(4)}, engine: ${this.engine}`),{tensor:y,width:l,height:d,resizeRatio:u,originalWidth:r,originalHeight:a}}async runInference(t,r,a){let n;try{this.log("Running detection inference..."),n=new this.platform.ort.Tensor("float32",t,[1,3,a,r]);let i={x:n},u=(await this.session.run(i))[this.session.outputNames[0]||"sigmoid_0.tmp_0"];return this.log("Detection inference complete!"),u?u.data:(console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`),null)}catch(i){throw console.error("Error during model inference:",i instanceof Error?i.message:String(i)),i}finally{n==null||n.dispose()}}postprocessDetection(t,r,a=this.options.minimumAreaThreshold??50,n=this.options.paddingVertical||.4,i=this.options.paddingHorizontal||.6){this.log("Post-processing detection results...");const{width:s,height:u,resizeRatio:l,originalWidth:d,originalHeight:c}=r;let h=Zy(t,s,u,this.platform.createCanvas.bind(this.platform));return this.lastDetectionCanvas=h,this.engine==="opencv"&&this.platform.imageProcessor?this.postprocessWithOpenCV(h,s,u,l,d,c,a,n,i):this.postprocessWithCanvasNative(h,l,d,c,a,n,i)}postprocessWithOpenCV(t,r,a,n,i,s,u,l,d){let c=this.platform.imageProcessor,h=new c.ImageProcessor(t);try{h.grayscale().convert({rtype:c.cv.CV_8UC1});let m=new c.Contours(h.toMat(),{mode:c.cv.RETR_LIST,method:c.cv.CHAIN_APPROX_SIMPLE}),_=Fy(m,r,a,n,i,s,u,l,d);return m.destroy(),this.log(`Found ${_.length} potential text boxes (opencv)`),_}finally{h.destroy()}}postprocessWithCanvasNative(t,r,a,n,i,s,u){let d=this.platform.canvas.createProcessor(t).grayscale().threshold({thresh:0}).findRegions({foreground:"light",minArea:i,thresh:0,padding:{vertical:s,horizontal:u},scale:1/r}),c=Gy(d,a,n);return this.log(`Found ${c.length} potential text boxes (canvas-native)`),c}async debugDetectionCanvas(t,r,a){let n=this.debugging.debugFolder??"";await this.platform.saveDebugImage(t,"detection-debug",n),this.log(`Probability map visualized and saved to: ${n}`)}async debugDetectedBoxes(t,r){let a=this.platform.isCanvas(t)?t:await this.platform.canvas.prepareCanvas(t),n=a.getContext("2d");for(let s of r){const{x:u,y:l,width:d,height:c}=s;this.platform.canvas.getToolkit().drawLine({ctx:n,x:u,y:l,width:d,height:c})}let i=this.debugging.debugFolder??"";await this.platform.saveDebugImage(a,"boxes-debug",i),this.log(`Boxes visualized and saved to: ${i}`)}}function Sd(e){return e.reason instanceof Error?e.reason:new DOMException("The batch operation was aborted.","AbortError")}function Yy(e){if(Symbol.asyncIterator in e)return e[Symbol.asyncIterator]();let t=e[Symbol.iterator]();return{next:()=>Promise.resolve(t.next()),return:r=>{var a;return Promise.resolve(((a=t.return)==null?void 0:a.call(t,r))??{done:!0,value:void 0})}}}async function Id(e,t,r,a){var w;const{settle:n,signal:i}=t;let s=Math.max(1,Math.floor(t.concurrency));if(i!=null&&i.aborted)throw Sd(i);let u=0,l=0,d=!1,c=!1,h,m=Array.isArray(e)?e:null,_=m?null:Yy(e),y=Promise.resolve(),b=async()=>{let C=y,S;y=new Promise(T=>{S=T}),await C;try{return await _.next()}finally{S()}},x=()=>{d=!0};i==null||i.addEventListener("abort",x,{once:!0});let $=async()=>{var C;for(;!d;){let S,T;if(m){if(u>=m.length)return;T=u++,S=m[T]}else{let k=await b();if(k.done||d)return;T=u++,S=k.value}try{let k=await r(S,T);if(d)return;a({index:T,status:"fulfilled",value:k})}catch(k){if(n)a({index:T,status:"rejected",reason:k});else{d=!0,c=!0,h=k;return}}finally{l++,(C=t.onProgress)==null||C.call(t,l,t.total)}}};try{await Promise.all(Array.from({length:s},()=>$()))}finally{i==null||i.removeEventListener("abort",x),await((w=_==null?void 0:_.return)==null?void 0:w.call(_))}if(i!=null&&i.aborted)throw Sd(i);if(c)throw h}function Xy(){let e=[],t=null,r=!1,a=null,n=()=>{let i=t;t=null,i==null||i()};return{push(i){e.push(i),n()},close(){r=!0,n()},fail(i){a={error:i},r=!0,n()},async*drain(){for(;;){for(;e.length>0;)yield e.shift();if(a)throw a.error;if(r)return;await new Promise(i=>{t=i})}}}}async function Qy(e,t,r,a){let n=e.canvas.getToolkit(),i=[];for(const[s,u]of r.entries()){let l=n.crop({bbox:{x0:u.x,y0:u.y,x1:u.x+u.width,y1:u.y+u.height},canvas:t});if(a.saveCropsTo&&e.saveImage){let d=`crop_${String(s).padStart(3,"0")}.png`;await e.saveImage(l,[a.saveCropsTo,d].join(e.pathSeparator))}a.crop&&i.push(await Jy(l))}return i}async function Jy(e){let t=e;if(typeof t.toBuffer=="function"){let r=t.toBuffer("image/png");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}if(typeof t.convertToBlob=="function")return(await t.convertToBlob({type:"image/png"})).arrayBuffer();if(typeof t.toBlob=="function"){let r=t.toBlob.bind(t);return(await new Promise((n,i)=>r(s=>s?n(s):i(new Error("Canvas toBlob() returned null")),"image/png"))).arrayBuffer()}throw new Error("Canvas cannot be encoded to a PNG buffer on this platform")}function e0(e){if(e.length===0)return{text:"",results:[],confidence:0};let t=e.map(a=>a.text).join(" "),r=e.reduce((a,n)=>a+n.confidence,0)/e.length;return{text:t,results:e,confidence:r}}function t0(e){if(e.length===0)return{text:"",lines:[],confidence:0};let t=[],r=[],a=e[0];if(!a)return{text:"",lines:[],confidence:0};let n=a.box.y,i=a.box.height;for(let d of e){const{box:c}=d;Math.abs(c.y-n)<i/2?(r.push(d),i=(i*(r.length-1)+c.height)/r.length):(r.sort((h,m)=>h.box.x-m.box.x),t.push(r),r=[d],n=c.y,i=c.height)}r.length>0&&(r.sort((d,c)=>d.box.x-c.box.x),t.push(r));let s=t.map(d=>d.map(c=>c.text).join(" ")).join(`
`),u=t.reduce((d,c)=>d+c.reduce((h,m)=>h+m.confidence,0),0),l=t.reduce((d,c)=>d+c.length,0);return{text:s,lines:t,confidence:l>0?u/l:0}}function Eh(e){if(e.length===0)return[];let t=[...e].sort((u,l)=>u.box.y-l.box.y||u.box.x-l.box.x),r=[],a=t[0];if(!a)return[];let n=[a],i=a.box.height,s=a.box.height;for(let u=1;u<t.length;u++){let l=t[u],d=t[u-1];if(!l||!d)continue;let c=Math.abs(l.box.y-d.box.y),h=s*.5;c<=h?(n.push(l),i+=l.box.height,s=i/n.length):(n.sort((m,_)=>m.box.x-_.box.x),r.push(n),n=[l],i=l.box.height,s=l.box.height)}return n.length>0&&(n.sort((u,l)=>u.box.x-l.box.x),r.push(n)),r}let r0=4,kd=16384;function Ah(e,t,r,a){let n=Math.min(...t.map(w=>w.box.x)),i=Math.min(...t.map(w=>w.box.y)),s=Math.max(...t.map(w=>w.box.x+w.box.width)),u=Math.max(...t.map(w=>w.box.y+w.box.height)),l={x:n,y:i,width:s-n,height:u-i},d=u-i,c=Math.max(1,Math.round(d*.4)),h=t.map(({box:w})=>Math.max(1,Math.round(w.width*Math.min(d/w.height,r0)))),m=h.reduce((w,C)=>w+C,0)+c*(t.length-1);if(m>kd){let w=kd/m;h=h.map(C=>Math.max(1,Math.round(C*w))),c=Math.max(1,Math.floor(c*w))}let _=h.reduce((w,C)=>w+C,0)+c*(t.length-1),y=r(_,d),b=y.getContext("2d");b.fillStyle="white",b.fillRect(0,0,_,d);let x=0,$=[];for(let w=0;w<t.length;w++){let C=t[w],S=h[w];if(!C||S===void 0)continue;const{box:T}=C;let k=a.getToolkit().crop({bbox:{x0:T.x,y0:T.y,x1:T.x+T.width,y1:T.y+T.height},canvas:e});b.drawImage(k,0,0,T.width,T.height,x,0,S,d);let A=w<t.length-1?c:0;$.push(S+A),x+=S+A}return{mergedCanvas:y,mergedBox:l,cropWidths:$}}function zh(e,t,r){let a=[...e];if(t.length!==a.length||r.length===0)return a0(e,r);let n=r.reduce((l,d)=>l+d,0),i=r.map(()=>""),s=0,u=(r[0]??0)/n;for(let l=0;l<a.length;l++){let d=t[l]??0;for(;d>=u&&s<r.length-1;)s++,u+=(r[s]??0)/n;i[s]+=a[l]??""}return i}let i0=4;function a0(e,t){if(t.length===1)return[e];let r=t.reduce((u,l)=>u+l,0),a=[...e],n=a.length>0?r/a.length:0,i=[],s=0;for(let u=0;u<t.length;u++){if(u===t.length-1){i.push(a.slice(s).join(""));break}let l=Math.min(s+Math.round((t[u]??0)/n),a.length),d=l,c=!1;for(let h=0;h<=i0&&!c;h++)for(let m of[l-h,l+h]){let _=a[m];if(m>s&&m<a.length&&_!==void 0&&/\s/.test(_)){d=m,c=!0;break}}i.push(a.slice(s,d).join("")),s=c?d+1:d}return i}function n0(e,t,r,a){let n=[...e].sort((u,l)=>t(l)-t(u)),i=[],s=[];for(let u of n){let l=!1;for(let d=0;d<i.length;d++){let c=i[d],h=s[d];if(c===void 0||h===void 0)continue;let m=a*c.length;if(h+m+t(u)<=r){c.push(u),s[d]=h+t(u),l=!0;break}}l||(i.push([u]),s.push(t(u)))}return i}class Oh{constructor(t=10){ve(this,"cache",new Map);ve(this,"maxSize");this.maxSize=t}get(t){let r=this.cache.get(t);if(r!==void 0)return this.cache.delete(t),this.cache.set(t,r),r}set(t,r){if(this.cache.has(t))this.cache.delete(t);else if(this.cache.size>=this.maxSize){let a=this.cache.keys().next().value;a!==void 0&&this.cache.delete(a)}this.cache.set(t,r)}clear(){this.cache.clear()}static generateKey(t){let r=new Uint8Array(t),a=Math.min(r.length,1024),n=0;for(let i=0;i<a;i++)n=(n<<5)-n+r[i],n=n&n;return`${n}_${r.length}`}}let Ed=new Oh;class s0{constructor(t,r){ve(this,"options",ka);ve(this,"detectionSession",null);ve(this,"recognitionSession",null);ve(this,"detector",null);ve(this,"recognitor",null);ve(this,"platform");this.platform=t,this.options=Ga({},ka,r),this.options.session=this.options.session||ka.session}log(t){var r;(r=this.options.debugging)!=null&&r.verbose&&console.log(`[PaddleOcrService:Base] ${t}`)}async recognize(t,r){var a,n;(!this.detector||!this.recognitor)&&await this.initSessions();try{let i;if(typeof t=="string"){if(!t.startsWith("http")&&!t.startsWith("/"))throw new Error("Invalid image string format. Must be an HTTP URL, an absolute path, ArrayBuffer, or Canvas");i=await this.platform.loadResource(t,t)}else if(t instanceof ArrayBuffer)i=t;else if(typeof t.toBuffer=="function"){let b=t.toBuffer("image/png");i=b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}else{let y=t,$=y.getContext("2d",{willReadFrequently:!0}).getImageData(0,0,y.width,y.height).data;i=$.buffer.slice($.byteOffset,$.byteOffset+$.byteLength)}let s=Oh.generateKey(i);if(!(r!=null&&r.noCache)&&!(r!=null&&r.dictionary)){let y=Ed.get(s);if(y)return this.log("Using cached OCR result"),r!=null&&r.flatten?{text:y.text,results:y.lines?y.lines.flat():y.results??[],confidence:y.confidence}:y}let u=[],l=typeof t=="string"||t instanceof ArrayBuffer?await this.platform.canvas.prepareCanvas(i):t;if(u=await this.detector.run(l),u.length===0)return r!=null&&r.flatten?{text:"",results:[],confidence:0}:{text:"",lines:[],confidence:0};let d=(a=this.options.recognition)==null?void 0:a.charactersDictionary;if(r!=null&&r.dictionary){let y="";if(typeof r.dictionary=="string"){let b=await this.platform.loadResource(r.dictionary,r.dictionary);y=new TextDecoder("utf-8").decode(b)}else y=new TextDecoder("utf-8").decode(r.dictionary);d=Ha(y)}let c=(r==null?void 0:r.strategy)??((n=this.options.recognition)==null?void 0:n.strategy)??"per-line",h=await this.recognitor.run(l,u,d,c),m=t0(h),_=r!=null&&r.flatten?e0(h):m;return!(r!=null&&r.noCache)&&!(r!=null&&r.dictionary)&&Ed.set(s,_),_}catch(i){let s=i instanceof Error?i:new Error(String(i));throw console.error("recognize: error",s.message,s.stack),i}}async detect(t,r){var c;this.detector||await this.initSessions();const{crop:a,saveCropsTo:n,...i}=r??{};let s=Object.keys(i).length>0?new kh(this.platform,this.detectionSession,{...this.options.detection,...i},this.options.debugging,((c=this.options.processing)==null?void 0:c.engine)??Ih):this.detector,u;if(typeof t=="string"){if(!t.startsWith("http")&&!t.startsWith("/"))throw new Error("Invalid image string format. Must be an HTTP URL, an absolute path, ArrayBuffer, or Canvas");u=await this.platform.canvas.prepareCanvas(await this.platform.loadResource(t,t))}else t instanceof ArrayBuffer?u=await this.platform.canvas.prepareCanvas(t):u=t;let l=(await s.run(u)).filter(h=>h.width>0&&h.height>0);if(!a&&!n)return{boxes:l};let d=await Qy(this.platform,u,l,{crop:a,saveCropsTo:n});return a?{boxes:l,crops:d}:{boxes:l}}async batchRecognize(t,r){let a=(r==null?void 0:r.settle)??!1,n=[];return await Id(t,{concurrency:this.resolveConcurrency(r==null?void 0:r.concurrency),settle:a,signal:r==null?void 0:r.signal,onProgress:r==null?void 0:r.onProgress,total:Array.isArray(t)?t.length:void 0},i=>this.recognize(i,r),i=>{n[i.index]=i}),a?n:n.map(i=>i.status==="fulfilled"?i.value:void 0)}async*batchRecognizeStream(t,r){let a=Xy(),n=(async()=>{try{await Id(t,{concurrency:this.resolveConcurrency(r==null?void 0:r.concurrency),settle:(r==null?void 0:r.settle)??!1,signal:r==null?void 0:r.signal,onProgress:r==null?void 0:r.onProgress,total:Array.isArray(t)?t.length:void 0},i=>this.recognize(i,r),i=>a.push(i)),a.close()}catch(i){a.fail(i)}})();yield*a.drain(),await n}resolveConcurrency(t){var n;return typeof t=="number"&&t>0?Math.floor(t):(((n=this.options.session)==null?void 0:n.executionProviders)??[]).some(i=>{let s=(typeof i=="string"?i:i.name).toLowerCase();return s!=="cpu"&&s!=="wasm"})?1:4}}let Ad=new Set(["cpu","wasm"]);function o0(e){return typeof e=="string"?e:e.name}async function u0(e,t,r,a,n){let i=r??{};try{return await e.InferenceSession.create(t,i)}catch(s){let l=(i.executionProviders??[]).map(o0);if(l.every(y=>Ad.has(y))||l.length===0)throw s;let h=l.find(y=>Ad.has(y))??(l.includes("wasm")?"wasm":"cpu"),m=s instanceof Error?s.message:String(s);a(`executionProviders=${JSON.stringify(l)} failed (${m}); falling back to ["${h}"].`);let _={...i,executionProviders:[h]};return n==null||n(_),e.InferenceSession.create(t,_)}}let Ka=null;function l0(e){Ka=e}function dt(){if(!Ka)throw new Error('No canvas platform registered. Import "ppu-ocv" (Node), "ppu-ocv/web" (browser), "ppu-ocv/canvas" (Node canvas-only), "ppu-ocv/canvas-web" (browser canvas-only), or "ppu-ocv/canvas-mobile" (React Native / Skia) to auto-register.');return Ka}function d0(e){return typeof e=="object"&&e!==null&&typeof e.getContext=="function"&&typeof e.width=="number"&&typeof e.height=="number"}let Rh={createCanvas(e,t){if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(e,t);if(typeof document<"u"){let r=document.createElement("canvas");return r.width=e,r.height=t,r}throw new Error("No canvas implementation available in this environment.")},async loadImage(e){let t;if(e instanceof ArrayBuffer)t=new Blob([e]);else if(typeof e=="string")t=await(await fetch(e)).blob();else throw new Error("loadImage: unsupported source type");let r=await createImageBitmap(t),a=Rh.createCanvas(r.width,r.height);return a.getContext("2d").drawImage(r,0,0),r.close(),a},isCanvas(e){return typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas}};const Nt=class Nt{constructor(){ve(this,"step",0)}static getInstance(){return Nt._baseInstance||(Nt._baseInstance=new Nt),Nt._baseInstance}crop(t){const{bbox:r,canvas:a}=t;let n=dt().createCanvas(r.x1-r.x0,r.y1-r.y0);return n.getContext("2d").drawImage(a,r.x0,r.y0,r.x1-r.x0,r.y1-r.y0,0,0,n.width,n.height),n}isDirty(t){const{canvas:r,threshold:a=127.5,majorColorThreshold:n=.97}=t;let i=0,s=0,u=this.crop({bbox:{x0:r.width*.1,y0:r.height*.1,x1:r.width*.9,y1:r.height*.9},canvas:r}),d=u.getContext("2d").getImageData(0,0,u.width,u.height).data;for(let h=0;h<d.length;h+=4){let m=d[h],_=d[h+1],y=d[h+2];m>=a&&_>=a&&y>=a?i++:s++}return Math.max(i,s)/(s+i)<n}drawLine(t){const{ctx:r,x:a,y:n,width:i,height:s,lineWidth:u=2,color:l="blue"}=t;r.beginPath(),r.strokeStyle=l,r.lineWidth=u,r.strokeRect(a,n,i,s),r.closePath()}drawContour(t){const{ctx:r,contour:a,strokeStyle:n="red",lineWidth:i=2}=t;let s=a.data32S;if(!(s.length<4)){r.strokeStyle=n,r.lineWidth=i,r.beginPath(),r.moveTo(s[0]??0,s[1]??0);for(let u=2;u<s.length;u+=2)r.lineTo(s[u]??0,s[u+1]??0);r.closePath(),r.stroke()}}};ve(Nt,"_baseInstance",null);let Za=Nt;async function p0(e){return d0(e)?e:dt().loadImage(e)}async function c0(e){if(e instanceof ArrayBuffer)return e;if(typeof e.toBuffer=="function"){let i=e.toBuffer("image/png"),s=new ArrayBuffer(i.byteLength);return new Uint8Array(s).set(new Uint8Array(i)),s}let t=e.toBlob;if(typeof t=="function")return(await new Promise((s,u)=>{t.call(e,l=>l?s(l):u(new Error("toBlob returned null")),"image/png")})).arrayBuffer();if(typeof e.convertToBlob=="function")return(await e.convertToBlob({type:"image/png"})).arrayBuffer();if(typeof e.toDataURL=="function"){let s=e.toDataURL("image/png").replace(/^data:image\/png;base64,/,""),u=atob(s),l=new ArrayBuffer(u.length),d=new Uint8Array(l);for(let c=0;c<u.length;c++)d[c]=u.charCodeAt(c);return l}let a=e.getContext("2d").getImageData(0,0,e.width,e.height),n=new ArrayBuffer(a.data.byteLength);return new Uint8Array(n).set(new Uint8Array(a.data.buffer,a.data.byteOffset,a.data.byteLength)),n}function f0(e,t,r,a={}){const{foreground:n="light",thresh:i=127,minArea:s=1,maxArea:u=1/0,padding:l,scale:d=1}=a;let c=new Uint8Array(t*r),h=[],m=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],_=y=>{let b=e[y]??0;return n==="light"?b>i:b<=i};for(let y=0;y<r;y++)for(let b=0;b<t;b++){let x=y*t+b;if(c[x]||(c[x]=1,!_(x*4)))continue;let $=[x],w=b,C=b,S=y,T=y,k=0;for(;$.length>0;){let A=$.pop();if(A===void 0)break;k++;let z=A%t,O=(A-z)/t;z<w?w=z:z>C&&(C=z),O<S?S=O:O>T&&(T=O);for(const[W,V]of m){let F=z+W,U=O+V;if(F<0||F>=t||U<0||U>=r)continue;let K=U*t+F;c[K]||(c[K]=1,_(K*4)&&$.push(K))}}if(k>=s&&k<=u){let A=w,z=S,O=C+1,W=T+1;if(l){let V=W-z,F=Math.round(V*(l.vertical??0)),U=Math.round(V*(l.horizontal??0));A=Math.max(0,A-U),z=Math.max(0,z-F),O=Math.min(t,O+U),W=Math.min(r,W+F)}d!==1&&(A=Math.max(0,Math.round(A*d)),z=Math.max(0,Math.round(z*d)),O=Math.round(O*d),W=Math.round(W*d)),h.push({bbox:{x0:A,y0:z,x1:O,y1:W},area:k})}}return h}class zd{constructor(t){ve(this,"_canvas");this._canvas=t}get width(){return this._canvas.width}get height(){return this._canvas.height}resize(t){const{width:r,height:a}=t;let n=dt().createCanvas(r,a);return n.getContext("2d").drawImage(this._canvas,0,0,r,a),this._canvas=n,this}grayscale(){const{width:t,height:r}=this._canvas;let a=this._canvas.getContext("2d").getImageData(0,0,t,r),n=a.data;for(let s=0;s<n.length;s+=4){let u=Math.round(.299*(n[s]??0)+.587*(n[s+1]??0)+.114*(n[s+2]??0));n[s]=u,n[s+1]=u,n[s+2]=u}let i=dt().createCanvas(t,r);return i.getContext("2d").putImageData(a,0,0),this._canvas=i,this}convert(t={}){const{alpha:r=1,beta:a=0}=t;if(r===1&&a===0)return this;const{width:n,height:i}=this._canvas;let s=this._canvas.getContext("2d").getImageData(0,0,n,i),u=s.data;for(let d=0;d<u.length;d+=4)u[d]=Math.round((u[d]??0)*r+a),u[d+1]=Math.round((u[d+1]??0)*r+a),u[d+2]=Math.round((u[d+2]??0)*r+a);let l=dt().createCanvas(n,i);return l.getContext("2d").putImageData(s,0,0),this._canvas=l,this}invert(){const{width:t,height:r}=this._canvas;let a=this._canvas.getContext("2d").getImageData(0,0,t,r),n=a.data;for(let s=0;s<n.length;s+=4)n[s]=255-(n[s]??0),n[s+1]=255-(n[s+1]??0),n[s+2]=255-(n[s+2]??0);let i=dt().createCanvas(t,r);return i.getContext("2d").putImageData(a,0,0),this._canvas=i,this}threshold(t={}){const{thresh:r=127,maxValue:a=255}=t,{width:n,height:i}=this._canvas;let s=this._canvas.getContext("2d").getImageData(0,0,n,i),u=s.data;for(let d=0;d<u.length;d+=4){let h=(u[d]===u[d+1]&&u[d+1]===u[d+2]?u[d]??0:Math.round(.299*(u[d]??0)+.587*(u[d+1]??0)+.114*(u[d+2]??0)))>r?a:0;u[d]=h,u[d+1]=h,u[d+2]=h}let l=dt().createCanvas(n,i);return l.getContext("2d").putImageData(s,0,0),this._canvas=l,this}border(t={}){const{size:r=10,color:a="white"}=t,{width:n,height:i}=this._canvas;let s=dt().createCanvas(n+r*2,i+r*2),u=s.getContext("2d");return u.fillStyle=a,u.fillRect(0,0,s.width,s.height),u.drawImage(this._canvas,r,r),this._canvas=s,this}rotate(t){const{angle:r,cx:a=this._canvas.width/2,cy:n=this._canvas.height/2}=t;if(r===0)return this;const{width:i,height:s}=this._canvas;let u=dt().createCanvas(i,s),l=u.getContext("2d");return l.save(),l.translate(a,n),l.rotate(-r*Math.PI/180),l.drawImage(this._canvas,-a,-n),l.restore(),this._canvas=u,this}findRegions(t={}){const{width:r,height:a}=this._canvas;let n=this._canvas.getContext("2d").getImageData(0,0,r,a).data;return f0(n,r,a,t)}toCanvas(){return this._canvas}static async prepareCanvas(t){return p0(t)}static async prepareBuffer(t){return c0(t)}}l0(Rh);class zn{constructor(){ve(this,"pathSeparator","/");ve(this,"ort",En);ve(this,"canvas",{prepareCanvas:t=>zd.prepareCanvas(t),createProcessor:t=>new zd(t),getToolkit:()=>Za.getInstance()})}createCanvas(t,r){let a=document.createElement("canvas");return a.width=t,a.height=r,a.getContext("2d",{willReadFrequently:!0}),a}isCanvas(t){return!!(t instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas||t&&typeof t.getContext=="function")}async loadResource(t,r){if(t instanceof ArrayBuffer)return t;let a=typeof t=="string"?t:r,n=await fetch(a);if(!n.ok)throw new Error(`Failed to fetch resource from ${a}`);return n.arrayBuffer()}async saveDebugImage(t,r,a){return Promise.resolve()}}typeof window<"u"&&!le.wasm.wasmPaths&&(le.wasm.wasmPaths="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/");async function h0(){if(typeof navigator>"u")return!1;let e=navigator;if(!e.gpu||typeof e.gpu.requestAdapter!="function")return!1;try{let t=await e.gpu.requestAdapter();return t!=null}catch{return!1}}async function m0(){return await h0()?["webgpu","wasm"]:["wasm"]}class Od extends kh{constructor(t,r={},a={}){super(new zn,t,r,a,"canvas-native")}}let Bh=0,Dh="<unk>",ni=8,g0=1.5,y0=2.5;function Rd(e){return new RegExp("\\p{L}","u").test(e)?0:new RegExp("\\p{N}","u").test(e)?1:2}function Mh(e,t){if(e.length<4)return;let r=[];for(let s=1;s<t.length;s++)r.push((t[s]??0)-(t[s-1]??0));let a=[...r].sort((s,u)=>s-u),n=a[Math.floor(a.length/2)]??0;if(n<=0)return;let i=a.find(s=>s>0)??0;if(!(i<=0))for(let s=e.length-1;s>=1;s--){let u=t[s-1]??0,l=t[s]??0,d=Rd(e[s]??"")===Rd(e[s-1]??"")?y0:g0;l-u>n+d*i&&e[s]!==" "&&e[s-1]!==" "&&e[s]!==e[s-1]&&(e.splice(s,0," "),t.splice(s,0,(u+l)/2))}}let _0=65248,b0=/[\u2E80-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/;function Nh(e,t){var r;for(let a=e.length-1;a>=1;a--)e[a]===" "&&e[a-1]===" "&&(e.splice(a,1),t.splice(a,1));if(!b0.test(e.join("")))for(let a=0;a<e.length;a++){let n=((r=e[a])==null?void 0:r.codePointAt(0))??0;n>=65281&&n<=65374?e[a]=String.fromCodePoint(n-_0):n===12288&&(e[a]=" ")}}function Ph(e,t,r,a){let n=a.length,i=n-1,s=[],u=-1,l=0,d=0,c=[];for(let m=0;m<t;m++){let _=m*r,y=e[_]??-1/0,b=0;for(let x=1;x<r;x++){let $=e[_+x]??-1/0;$>y&&(y=$,b=x)}if(b===Bh||b===u){u=b;continue}if(b>=0&&b<n){let x=a[b]??"";b===i?x!==Dh&&(s.push(" "),l+=y,d++,c.push((m+.5)/t)):(s.push(x),l+=y,d++,c.push((m+.5)/t))}u=b}Mh(s,c),Nh(s,c);let h=d>0?l/d:0;return{text:s.join(""),confidence:h,positions:c}}function Uh(e,t,r,a=!1){let n=e.data,i=e.dims,s=i[1],u=i[2]??r;if(!t)return{text:"",confidence:0,positions:[]};let l=t;return t.length===u-1?l=["",...t]:u!==t.length&&a&&console.warn(`Warning: Model output classes (${u}) does not match dictionary length (${t.length}).
 Consider using our model & dictionary catalogue at https://github.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models.`),Ph(n,s,u,l)}var w0=Object.freeze({__proto__:null,BLANK_INDEX:Bh,MIN_CROP_WIDTH:ni,UNK_TOKEN:Dh,ctcGreedyDecode:Ph,decodeResults:Uh,injectGapSpaces:Mh,refineDecodedChars:Nh});async function Wh(e,t,r,a){let n=e.width,i=e.height;if(i===0||n===0)throw new Error(`Crop dimensions are zero: ${n}x${i}`);let s=n/i,u=Math.max(ni,Math.round(t*s));if(r){let c=new r.ImageProcessor(e);try{return c.resize({width:u,height:t}),{imageTensor:On(c.toCanvas(),u,t),tensorWidth:u,tensorHeight:t}}finally{c.destroy()}}let l=a(e).resize({width:u,height:t});return{imageTensor:Lh(l,u,t),tensorWidth:u,tensorHeight:t}}function Lh(e,t,r){let a=e.toCanvas();return On(a,t,r)}function On(e,t,r){let i=e.getContext("2d").getImageData(0,0,t,r).data,s=r*t,u=new Float32Array(3*s),l=1/127.5;for(let d=0,c=0;d<s;d++,c+=4)u[d]=(i[c]??0)*l-1;return u.copyWithin(s,0,s),u.copyWithin(s*2,0,s),u}var v0=Object.freeze({__proto__:null,createImageTensor:Lh,createImageTensorFromCanvas:On,preprocessImage:Wh});function qh(e,t,r){return r.getToolkit().crop({bbox:{x0:t.x,y0:t.y,x1:t.x+t.width,y1:t.y+t.height},canvas:e})}async function Ya(e,t,r){let a=t.options.imageHeight??48,n=t.engine==="opencv"?t.platform.imageProcessor:void 0;const{imageTensor:i,tensorWidth:s,tensorHeight:u}=await Wh(e,a,n,t.platform.canvas.createProcessor.bind(t.platform.canvas));let l;try{l=new t.platform.ort.Tensor("float32",i,[1,3,u,s]);let d=await t.runInference(l),c=r??t.options.charactersDictionary??[];return Uh(d,c,s,t.debugging.verbose)}finally{l==null||l.dispose()}}function Rn(e){return[...e].sort((t,r)=>Math.abs(t.box.y-r.box.y)<(t.box.height+r.box.height)/4?t.box.x-r.box.x:t.box.y-r.box.y)}async function $0(e,t,r,a,n){let i=r.debugging.debugFolder?`${r.debugging.debugFolder}${r.platform.pathSeparator}crops`:"";if(r.debugging.debug&&i){let u=r.platform.canvas.getToolkit();"clearOutput"in u&&typeof u.clearOutput=="function"&&u.clearOutput(i)}let s=[];for(const{box:u,index:l}of t){let d=await a(e,u,l,t.length,i,n);d!==null&&s.push(d)}return Rn(s)}async function x0(e,t,r,a){let n=Eh(t),i=[];for(let s of n)if(s.length===1){let u=s[0];if(!u)continue;const{box:l}=u;let d=qh(e,l,r.platform.canvas);const{text:c,confidence:h}=await Ya(d,r,a);i.push({text:c,box:l,confidence:h})}else{const{mergedCanvas:u,cropWidths:l}=Ah(e,s,r.platform.createCanvas.bind(r.platform),r.platform.canvas),{text:d,confidence:c,positions:h}=await Ya(u,r,a);let m=zh(d,h,l);for(let _=0;_<s.length;_++){let y=s[_];y&&i.push({text:(m[_]??"").trim(),box:y.box,confidence:c})}}return Rn(i)}async function C0(e,t,r,a){let n=Eh(t),i=r.options.imageHeight??48,s=20,u=[];for(let y of n)if(y.length===1){let b=y[0];if(!b)continue;let x=qh(e,b.box,r.platform.canvas);u.push({canvas:x,boxes:y,cropWidths:[x.width]})}else{const{mergedCanvas:b,cropWidths:x}=Ah(e,y,r.platform.createCanvas.bind(r.platform),r.platform.canvas);u.push({canvas:b,boxes:y,cropWidths:x})}let l=u.map(({canvas:y,boxes:b,cropWidths:x},$)=>{let w=y.width/y.height,C=Math.max(ni,Math.round(i*w));return{canvas:y,boxes:b,cropWidths:x,resizedWidth:C,originalHeight:y.height,index:$}}),d=Math.max(...l.map(y=>y.resizedWidth)),c=r.options.crossLineWidthFactor??1.5,h=Math.round(d*c),m=n0(l,y=>y.resizedWidth,h,s),_=[];for(let y of m){let b=[...y].sort((U,K)=>U.index-K.index),x=Math.max(...b.map(U=>U.originalHeight)),$=b.map(U=>{if(U.originalHeight>=x)return U.resizedWidth;let K=x/U.originalHeight;return Math.max(ni,Math.round(U.resizedWidth*K))}),C=$.reduce((U,K)=>U+K,0)+s*(b.length-1),S=r.platform.createCanvas(C,i),T=S.getContext("2d");T.fillStyle="white",T.fillRect(0,0,C,i);let k=0;for(let U=0;U<b.length;U++){let K=b[U],ie=$[U];K===void 0||ie===void 0||(T.drawImage(K.canvas,0,0,K.canvas.width,K.canvas.height,k,0,ie,i),k+=ie,U<b.length-1&&(k+=s))}const{text:A,confidence:z,positions:O}=await Ya(S,r,a);let W=[],V=[];for(let U=0;U<b.length;U++){let K=b[U],ie=$[U];if(!K||ie===void 0)continue;let Y=ie/K.canvas.width;for(let se=0;se<K.boxes.length;se++){let Z=K.boxes[se];if(!Z)continue;let te=(K.cropWidths[se]??0)*Y;se===K.boxes.length-1&&U<b.length-1&&(te+=s),W.push(te),V.push(Z)}}let F=zh(A,O,W);for(let U=0;U<V.length;U++){let K=V[U];K&&_.push({text:(F[U]??"").trim(),box:K.box,confidence:z})}}return Rn(_)}class T0{constructor(t,r,a={},n={},i="opencv"){ve(this,"options");ve(this,"debugging");ve(this,"session");ve(this,"platform");ve(this,"engine");this.platform=t,this.session=r,this.options={...Sh,...a},this.debugging={...An,...n},i==="opencv"&&!this.platform.imageProcessor?this.engine="canvas-native":this.engine=i}log(t){this.debugging.verbose&&console.log(`[RecognitionService] ${t}`)}async run(t,r,a,n="per-line"){this.log("Starting text recognition process");try{let i;this.platform.isCanvas(t)?i=t:this.engine==="opencv"&&this.platform.imageProcessor?i=await this.platform.imageProcessor.prepareCanvas(t):i=await this.platform.canvas.prepareCanvas(t);let s=this.filterValidBoxes(r);if(s.length===0)return[];let u=this.buildContext(),l;switch(n){case"cross-line":l=await C0(i,s,u,a);break;case"per-line":l=await x0(i,s,u,a);break;case"per-box":default:l=await $0(i,s,u,(c,h,m,_,y,b)=>this.processBox(c,h,m,_,y,b),a)}let d=this.options.minimumConfidence??.5;return d>0?l.filter(c=>{let h=/[\p{L}\p{N}]/u.test(c.text)?d:Math.min(1,d+.3);return c.confidence>=h}):l}catch(i){return console.error("Error during text recognition:",i instanceof Error?i.message:String(i)),[]}}buildContext(){return{platform:this.platform,options:this.options,debugging:this.debugging,engine:this.engine,runInference:t=>this.runInference(t)}}filterValidBoxes(t){return t.map((r,a)=>({box:r,index:a})).filter(({box:r,index:a})=>this.isValidBox(r,a))}async processBox(t,r,a,n,i,s){let u=Date.now();try{let l=this.platform.canvas.getToolkit().crop({bbox:{x0:r.x,y0:r.y,x1:r.x+r.width,y1:r.y+r.height},canvas:t}),d=this.buildContext();const{text:c,confidence:h}=await this.recognizeTextViaContext(l,d,s);if(this.debugging.debug&&i){await this.platform.saveDebugImage(l,`crop_${String(a).padStart(3,"0")}.png`,i);let m=Date.now()-u;this.log(`Box ${a+1}/${n}: [x:${r.x}, y:${r.y}, w:${r.width}, h:${r.height}]
	 → "${c}" (processed in ${m}ms)
`)}return{text:c,box:r,confidence:h}}catch(l){let d=l instanceof Error?l:new Error(String(l));return console.error(`Error processing box ${a+1}: ${d.message}`,d.stack),null}}async recognizeTextViaContext(t,r,a){const{preprocessImage:n}=await Promise.resolve().then(function(){return v0}),{decodeResults:i}=await Promise.resolve().then(function(){return w0});let s=r.options.imageHeight??48,u=r.engine==="opencv"?r.platform.imageProcessor:void 0;const{imageTensor:l,tensorWidth:d,tensorHeight:c}=await n(t,s,u,r.platform.canvas.createProcessor.bind(r.platform.canvas));let h;try{h=new r.platform.ort.Tensor("float32",l,[1,3,c,d]);let m=await r.runInference(h),_=a??r.options.charactersDictionary??[];return i(m,_,d,this.debugging.verbose)}finally{h==null||h.dispose()}}isValidBox(t,r){return t.width<=0||t.height<=0?(console.warn(`Skipping invalid box ${r+1}: w=${t.width}, h=${t.height}`),!1):!0}async runInference(t){let r={x:t},a=await this.session.run(r),n=Object.keys(a)[0],i=n?a[n]:void 0;if(!i)throw new Error(`Recognition output tensor '${n}' not found. Available keys: ${Object.keys(a)}`);return i}}class Bd extends T0{constructor(t,r={},a={}){super(new zn,t,r,a,"canvas-native")}}let S0={graphOptimizationLevel:"all"};class Dd extends s0{constructor(t){super(new zn,t),(this.options.session===void 0||Object.keys(this.options.session).length===0)&&(this.options.session=S0)}async initSessions(){throw new Error("Initialization is handled proactively in PaddleOcrService. Call initialize() instead.")}async _loadResource(t,r){if(t instanceof ArrayBuffer)return this.log("Loading resource from ArrayBuffer"),t;let a=typeof t=="string"?t:r;return this.log(`Fetching resource from URL: ${a}`),Wy(a)}async _resolveSessionExecutionProviders(){let t=this.options.session??{};if(t.executionProviders&&t.executionProviders.length>0){this.log(`Using user-provided executionProviders: ${JSON.stringify(t.executionProviders)}`);return}let r=await m0();this.options.session={...t,executionProviders:r},this.log(`Resolved executionProviders: ${JSON.stringify(r)}`)}async _createSession(t){return u0(En,t,this.options.session,r=>console.warn(`[PaddleOcrService] ${r}`),r=>this.options.session=r)}async initialize(){var t,r,a;try{this.log("Initializing PaddleOcrService (Web)..."),await this._resolveSessionExecutionProviders();const[n,i,s]=await Promise.all([this._loadResource((t=this.options.model)==null?void 0:t.detection,Gt.detection),this._loadResource((r=this.options.model)==null?void 0:r.recognition,Gt.recognition),this._loadResource((a=this.options.model)==null?void 0:a.charactersDictionary,Gt.charactersDictionary)]),[u,l]=await Promise.all([this._createSession(new Uint8Array(n)),this._createSession(new Uint8Array(i))]);this.detectionSession=u,this.recognitionSession=l,this.options.model&&(this.options.model.detection=n),this.options.model&&(this.options.model.recognition=i),this.log(`Detection ONNX model loaded successfully
	input: ${u.inputNames}
	output: ${u.outputNames}`),this.log(`Recognition ONNX model loaded successfully
	input: ${l.inputNames}
	output: ${l.outputNames}`);let d=Ha(s);if(d.length===0)throw new Error("Character dictionary is empty or could not be loaded.");this.options.model&&(this.options.model.charactersDictionary=s),this.options.recognition&&(this.options.recognition.charactersDictionary=d),this.log(`Character dictionary loaded with ${d.length} entries.`),this.detector=new Od(u,this.options.detection,this.options.debugging),this.recognitor=new Bd(l,this.options.recognition,this.options.debugging),this.options.model&&(this.options.model.detection=void 0),this.options.model&&(this.options.model.recognition=void 0)}catch(n){throw console.error("Failed to initialize PaddleOcrService Web:",n),n}}isInitialized(){return this.detectionSession!==null&&this.recognitionSession!==null}async changeDetectionModel(t){var a;this.log("Changing detection model...");let r=await this._loadResource(t,Gt.detection);await((a=this.detectionSession)==null?void 0:a.release()),this.detectionSession=await this._createSession(new Uint8Array(r)),this.detector=new Od(this.detectionSession,this.options.detection,this.options.debugging),this.options.model&&(this.options.model.detection=r),this.log("Detection model changed successfully.")}async changeRecognitionModel(t){var a;this.log("Changing recognition model...");let r=await this._loadResource(t,Gt.recognition);await((a=this.recognitionSession)==null?void 0:a.release()),this.recognitionSession=await this._createSession(new Uint8Array(r)),this.recognitor=new Bd(this.recognitionSession,this.options.recognition,this.options.debugging),this.options.model&&(this.options.model.recognition=r),this.log("Recognition model changed successfully.")}async changeTextDictionary(t){this.log("Changing text dictionary...");let r=await this._loadResource(t,Gt.charactersDictionary),a=Ha(r);if(a.length===0)throw new Error("Character dictionary is empty or could not be loaded.");this.options.model&&(this.options.model.charactersDictionary=r),this.options.recognition&&(this.options.recognition.charactersDictionary=a),this.log(`Character dictionary changed successfully with ${a.length} entries.`)}async recognize(t,r){return super.recognize(t,r)}async destroy(){var t,r;await((t=this.detectionSession)==null?void 0:t.release()),await((r=this.recognitionSession)==null?void 0:r.release()),this.detectionSession=null,this.recognitionSession=null,this.detector=null,this.recognitor=null}}let Ht=null,Zr=null,Kt=!1;async function I0(){return Kt&&Ht?!0:Zr||(Zr=(async()=>{try{const e=await import("./opencv-DFP0M-wW.js").then(function(r){return r.o}),t=e.default||e;if(t&&t.Mat)return Ht=t,Kt=!0,console.log("⚡ [OpenCV.js WASM] C++ Vision Engine initialized successfully!"),!0;if(t&&typeof t.then=="function")return Ht=await t,Kt=!0,console.log("⚡ [OpenCV.js WASM] Async C++ Vision Engine initialized!"),!0;if(t&&t.onRuntimeInitialized)return new Promise(r=>{t.onRuntimeInitialized=()=>{Ht=t,Kt=!0,console.log("⚡ [OpenCV.js WASM] Runtime initialized!"),r(!0)},setTimeout(()=>{t.Mat?(Ht=t,Kt=!0,r(!0)):r(!1)},1500)});if(t)return Ht=t,Kt=!0,!0}catch(e){console.warn("[OpenCV.js WASM Init] Failed to load OpenCV WASM module, fallback to JS loops:",e)}return!1})(),Zr)}I0().catch(()=>{});function k0(e,t,r,a=1.3,n=1){if(!(t<=0||r<=0))try{const i=e.getImageData(0,0,t,r),s=e.getImageData(0,0,t,r);E0(s.data,t,r,n);const u=i.data;for(let l=0;l<u.length;l+=4)for(let d=0;d<3;d++){const c=i.data[l+d]-s.data[l+d];u[l+d]=Math.min(255,Math.max(0,Math.round(i.data[l+d]+c*a)))}e.putImageData(i,0,0)}catch(i){console.warn("Unsharp mask failed:",i)}}function E0(e,t,r,a){const n=new Uint8ClampedArray(e.length);for(let i=0;i<r;i++)for(let s=0;s<t;s++){let u=0,l=0,d=0,c=0;for(let m=-a;m<=a;m++){const _=s+m;if(_<0||_>=t)continue;const y=(i*t+_)*4;u+=e[y],l+=e[y+1],d+=e[y+2],c++}const h=(i*t+s)*4;n[h]=u/c,n[h+1]=l/c,n[h+2]=d/c,n[h+3]=e[h+3]}e.set(n)}function A0(e,t=1,r=.6,a=!1){if(!e)return!1;const n=e.trim();if(t<r||n.length===0||/^[\p{P}\p{S}\s]+$/u.test(n)||/^[.\-!?,:;~_+=*/\\|@#$%^&*()\[\]{}<>"'\s\d]+$/.test(n)&&!/[\p{L}]/u.test(n)||/^[\d\s]+$/.test(n)||/^\d{1,2}:\d{2}\s*[/|-]\s*\d{1,2}:\d{2}$/.test(n)||/^(1080p|720p|4k|60fps|hd|sub|cc|subscribe|like|share)$/i.test(n))return!1;if(a&&!/[\u4e00-\u9fff\u3400-\u4dbf]/.test(n)){const s=n.replace(/[^A-Za-z0-9]/g,"").toUpperCase();if(!new Set(["OK","VIP","DNA","CPU","GPU","FBI","CEO","APP","KTV","NPC","SOS","AI","BYE","HI","YES","NO","CD","DVD","TV","ID","HD","3D","4D","VR","AR","WIFI","GPS","SIM","SMS","ATM","POS","PPT","PDF","MV","PK","CP","CCTV","NBA","CBA","KFC","DJ","MC","UFO","MVP"]).has(s))return!1}return!0}function z0(e){if(!e)return"";const t=e.trim();if(!/[\u4e00-\u9fff\u3400-\u4dbf]/.test(t)){const n=t.replace(/[^A-Za-z0-9]/g,"").toUpperCase();return new Set(["OK","VIP","DNA","CPU","GPU","FBI","CEO","APP","KTV","NPC","SOS","AI","BYE","HI","YES","NO","CD","DVD","TV","ID","HD","3D","4D","VR","AR","WIFI","GPS","SIM","SMS","ATM","POS","PPT","PDF","MV","PK","CP","CCTV","NBA","CBA","KFC","DJ","MC","UFO","MVP"]).has(n)?t:""}let a=t;return a=a.replace(new RegExp("(?<![\\p{L}\\p{N}])[A-Za-z]{1,5}(?![\\p{L}\\p{N}])","gu")," "),a=a.replace(new RegExp("(?<![\\p{L}\\p{N}])\\d{1,4}(?![\\p{L}\\p{N}])","gu")," "),a=a.replace(/^[A-Za-z0-9\s\p{P}]+(?=[\u4e00-\u9fff\u3400-\u4dbf])/u,""),a=a.replace(new RegExp("(?<=[\\u4e00-\\u9fff\\u3400-\\u4dbf])[A-Za-z0-9\\s\\p{P}]+$","u"),""),a=a.replace(/\s+/g," ").trim(),a=a.replace(/([\u4e00-\u9fa5\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af])\s+([\u4e00-\u9fa5\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af])/g,"$1$2"),jh(a)}function O0(e){if(!e)return"";let t=e.replace(/[\x00-\x1F\x7F]/g,"").trim();return t=t.replace(/^[•\-–—*#+]+\s*/,""),t=t.replace(/\s*[•*#+]+$/,""),t=t.replace(/\s+/g," ").trim(),t}function R0(e,t=!0){if(!e)return"";if(!t)return e;let r=e.replace(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef]/g," ");return r=r.replace(/\s+/g," ").trim(),r}function Vh(e){if(!e)return"";let t=e.trim();if(!/[\u4e00-\u9fff\u3400-\u4dbf]/.test(t))return t;const a=/^(口碑|口袋|口角|口才|口语|口粮|口气|口令|口供|口头|口齿|口音|口味|口红|口信|口实|口决|口诀|口渴|口吻|口号|口服|口罩|口试|口吃|口拙|口诛|口木|口算|口译|口腔|口述|口条|口疮|口风|口紧|口轻)/,n=/^(了解|了结|了不起|了然|了如指掌|着重|着想|着手|着陆|着急|着力|着落|着眼|着迷|着实|过去|过分|过度|过错|过瘾|过往|过关|过目|过程|过滤|过问|过节|过夜|过头|过招|过秤|过客)/,i=/(?:第一|周一|星期一|礼拜一|初一|高一|大一|专一|唯一|合二为一|始终如一|万分之一|百分之一|归一|万一|统一|不一|九九归一|天人合一|表里如一|政企合一|二合一|三合一|缺一|加一|数一数二|独一无二)$/,s=/(?:伤|借|关|胸|门|入|出|路|渡|港|窗|虎|胃|海|风|枪|水|井|破|糊|松|亲|张|合|开|闭|随|灭|改|夸|漱|忌|吞|咽|交|众|人|户|大|小|两|三|四|五|多|这|那|一|脱|换|封|转|缺)口$/;let u=!0,l=0;for(;u&&l<5;){u=!1,l++;const d=t;if(t=t.replace(/^[—–\-·•·■□▲◆\s.,;:!?~_+=*/\\|@#$%^&*()\[\]{}<>"'“”‘’（）【】《》、，。！？：；…]+/,""),t=t.replace(/[—–\-·•·■□▲◆\s.,;:!?~_+=*/\\|@#$%^&*()\[\]{}<>"'“”‘’（）【】《》、，。！？：；…]+$/,""),t!==d&&(u=!0),t.length<2||(/^[丶丨丿亅乙乚卜丁冖冫几凵勹匕匚冂卩厶又](?=[\u4e00-\u9fff\u3400-\u4dbf])/.test(t)&&t.length>=2&&(t=t.slice(1).trim(),u=!0),t.startsWith("一")&&t.length>=2&&/^一(?=[这那你有我是他她它您谁甚什怎为因所快别请去到在听看想要能可真太没不若虽当好就但如果现原其然既已经将只被给把让再还正刚自从与跟及或该此处各每某即便乃莫非毋勿未否岂何胡曷奚安焉聊且姑略微稍渐极甚颇最更越愈益顶倒反却偏哪怕就算纵然即便只要除非以免大家大伙])/.test(t)&&(t=t.slice(1).trim(),u=!0),t.startsWith("口")&&t.length>=2&&!a.test(t)&&(t=t.slice(1).trim(),u=!0),t.length>=2&&/^[了吧呢吗啊呀哇么嘛啦喽]/.test(t)&&!n.test(t)&&(t=t.slice(1).trim(),u=!0),t.length>=2&&/^[个的得地](?=[你我他她它您这那谁甚什怎快别请])/.test(t)&&(t=t.slice(1).trim(),u=!0),t.length<3))break;/[丶丨丿亅乙乚卜丁冖冫几凵勹匕匚冂卩厶又]$/.test(t)&&t.length>=3&&(t=t.slice(0,-1).trim(),u=!0),t.endsWith("一")&&t.length>=3&&!i.test(t)&&(t=t.slice(0,-1).trim(),u=!0),t.endsWith("口")&&t.length>=3&&!s.test(t)&&(t=t.slice(0,-1).trim(),u=!0);const m=t;t=t.replace(/([啊呢吧吗呀哇么嘛啦喽])([个了一口丶丨丿亅])$/,"$1"),t!==m&&(u=!0)}return t}function jh(e){if(!e)return"";let t=e.trim();return/[\u4e00-\u9fff\u3400-\u4dbf]/.test(t)?Vh(t):t}function B0(e){if(!e)return"";let t=O0(e);return t=t.replace(/([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af])\s+([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af])/g,"$1$2"),t=t.replace(/([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af])\s+([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af])/g,"$1$2"),t=t.replace(/陈亥/g,"陈玄").replace(/陳亥/g,"陳玄"),t=t.replace(/蛻/g,"蜕"),t=t.replace(/説/g,"说"),t=t.replace(/什麽/g,"什么").replace(/爲什麽/g,"为什么").replace(/什莫/g,"什么"),t=t.replace(/(\d+)[Oo]([\u4e00-\u9fa5\u3400-\u4dbf\d])/g,"$10$2"),t=t.replace(/([\u4e00-\u9fa5\u3400-\u4dbf])(\d*)[Oo](\d*)([\u4e00-\u9fa5\u3400-\u4dbf])/g,"$1$20$3$4"),t=t.replace(/([\u4e00-\u9fa5\u3400-\u4dbf])[Oo]([\u4e00-\u9fa5\u3400-\u4dbf])/g,"$10$2"),t=jh(t),t=t.replace(/\b([A-Za-z])1([A-Za-z])\b/g,"$1i$2"),t=t.replace(/\b0([a-z]{2,})\b/g,"o$1"),t=t.replace(/\bvv([a-z]+)\b/gi,"w$1"),t=t.replace(/([a-zA-Z\u00C0-\u1EF9])\s+(['`?~.])/g,"$1$2"),(t.match(/"/g)||[]).length%2!==0&&(t.startsWith('"')&&!t.endsWith('"')?t=t+'"':!t.startsWith('"')&&t.endsWith('"')&&(t='"'+t)),t.includes("(")&&!t.includes(")")&&(t=t+")"),t.includes("[")&&!t.includes("]")&&(t=t+"]"),t.trim()}if(typeof self<"u"){if(typeof OffscreenCanvas<"u"&&OffscreenCanvas.prototype.getContext){const e=OffscreenCanvas.prototype.getContext;OffscreenCanvas.prototype.getContext=function(t,r){return t==="2d"&&(r={willReadFrequently:!0,...r||{}}),e.call(this,t,r)}}typeof self.document>"u"&&(self.document={createElement:e=>(e==="canvas"||typeof e=="string"&&e.toLowerCase()==="canvas")&&typeof OffscreenCanvas<"u"?new OffscreenCanvas(300,150):{getContext:()=>null,style:{},setAttribute:()=>{},appendChild:()=>{}},head:{appendChild:()=>{}},body:{appendChild:()=>{}}}),typeof self.HTMLCanvasElement>"u"&&typeof OffscreenCanvas<"u"&&(self.HTMLCanvasElement=OffscreenCanvas),typeof self.window>"u"&&(self.window=self)}try{le.logLevel="error",le.wasm.simd=!0,le.wasm.numThreads=1,le.wasm.proxy=!1,le.wasm.wasmPaths="/ort-wasm/",typeof self<"u"&&(self.ort=En)}catch{}function D0(e){const t=e.split(","),r=t.length>1?t[1]:t[0],a=atob(r),n=a.length,i=new Uint8Array(n);for(let s=0;s<n;s++)i[s]=a.charCodeAt(s);return i.buffer}function Md(e){if(!e)return!1;const t=e.toLowerCase();return t.startsWith("vi")||t.startsWith("en")||t.startsWith("fr")||t.startsWith("es")||t.startsWith("de")||t.startsWith("id")||t.startsWith("pt")||t.startsWith("it")||t.startsWith("ru")||t.includes("tiếng việt")||t.includes("english")}function Nd(e,t=!1){if(!e)return"";let r=e.replace(/[\x00-\x1F\x7F]/g,"").trim();return r=r.replace(/[ \t]+/g," ").trim(),t?r=R0(r,!0):r=Vh(z0(r)),B0(r)}let pe=null;function Xa(e){let t="";if(typeof e=="string")t=e;else if(e&&e.byteLength>0)t=new TextDecoder("utf-8").decode(e);else return new ArrayBuffer(0);return(t.charCodeAt(0)===65279||t.startsWith("\uFEFF"))&&(t=t.slice(1)),t=t.replace(/\r\n/g,`
`).replace(/\r/g,""),new TextEncoder().encode(t).buffer}function Zt(e){return e instanceof ArrayBuffer?e:e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}function wr(e){if(!e||e.byteLength<5e4)return!1;const t=new Uint8Array(e,0,Math.min(128,e.byteLength));if(t[0]===60||t[0]===123||t.length>=9&&t[6]===239&&t[7]===191&&t[8]===189)return!1;const r=new TextDecoder("utf-8").decode(t.subarray(0,64)).toLowerCase();return!(r.startsWith("<!doctype")||r.startsWith("<html")||r.startsWith('{"')||r.includes("<html")||r.includes("<!doc")||r.includes("git-lfs")||r.includes("version https://")||r.includes("404 not found")||r.includes("access denied"))}const M0="https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_det_onnx/resolve/main/inference.onnx?download=true",N0="https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_rec_onnx/resolve/main/inference.onnx?download=true",Pd=["/det.onnx","/api/paddle-models/det","/api/ocr/model/det",M0],Ud=["/rec.onnx","/api/paddle-models/rec","/api/ocr/model/rec",N0],Wd=["/dict.txt","/api/paddle-models/dict","/ppocrv6_tiny_dict.txt","/api/ocr/model/dict","https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.8/ppocr/utils/ppocr_keys_v1.txt","https://huggingface.co/x3zvawq/paddleocr-js-onnx/resolve/main/ppocr_v5_mobile/ppocrv5_dict.txt","https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv5_dict.txt"];async function Yt(e,t=!1){for(const r of e){const a=r.includes("huggingface.co")&&r.includes("/blob/")?r.replace("/blob/","/resolve/"):r;try{const n=await fetch(a);if(!n.ok||(n.headers.get("content-type")||"").toLowerCase().includes("text/html"))continue;const s=await n.arrayBuffer();if(t){if(s&&s.byteLength>10)return Xa(s)}else if(s&&s.byteLength>5e4&&wr(s))return s}catch{}}return null}const Fh="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/";async function P0(){try{const e=await fetch("/ort-wasm/ort-wasm-simd-threaded.wasm",{method:"GET"});if(e.ok&&!(e.headers.get("content-type")||"").toLowerCase().includes("text/html")){const r=await e.arrayBuffer(),a=new Uint8Array(r);if(a.length>=5e6&&a[0]===0&&a[1]===97&&a[2]===115&&a[3]===109)return"/ort-wasm/"}}catch{}return Fh}let Ea=!1;const Qa=[];self.onmessage=e=>{Qa.push(e),Gh()};async function Gh(){if(Ea||Qa.length===0)return;Ea=!0;const e=Qa.shift();try{await U0(e)}finally{Ea=!1,Gh()}}async function U0(e){var l,d,c,h;const{type:t,detBuffer:r,recBuffer:a,dictBuffer:n,frames:i,workerId:s}=e.data,u=typeof s=="number"?s:1;if(t==="INIT"){const m=typeof navigator<"u"&&"gpu"in navigator;try{try{const _=typeof navigator<"u"&&navigator.hardwareConcurrency||4;le.logLevel="error",le.wasm.simd=!0,le.wasm.numThreads=1,le.wasm.proxy=!1,le.wasm.wasmPaths=await P0(),typeof le.webgpu=="object"&&le.webgpu!==null&&(le.webgpu.powerPreference="high-performance"),console.log(`[OCR Worker #${u}] WebGPU: ${m?"ACTIVE":"INACTIVE"} | Cores: ${_} | WASM Threads: ${le.wasm.numThreads}`)}catch(_){console.warn(`[OCR Worker #${u} Setup Warning]`,_)}if(!pe){let _=r&&wr(r)?r:null,y=a&&wr(a)?a:null,b=n&&(n.byteLength>10||n.length>10)?Xa(n):null;if(_||(_=await Yt(Pd)),y||(y=await Yt(Ud)),b||(b=await Yt(Wd,!0)),!_||!y)throw new Error("Không thể tải tệp trọng số ONNX Model PaddleOCR");const x=["wasm"];pe=new Dd({model:{detection:Zt(_),recognition:Zt(y),charactersDictionary:b?Zt(b):void 0},detection:{thresh:.25,boxThresh:.55,box_thresh:.55,unclipRatio:1.7,unclip_ratio:1.7,minSize:3,min_size:3,scoreThresh:.35,dropScore:.35,drop_score:.35},recognition:{lang:"ch",recAlgorithm:"CRNN",rec_algorithm:"CRNN",imageHeight:48,recImageShape:[3,48,640],rec_image_shape:[3,48,640],recBatchNum:64,rec_batch_num:64,maxTextLength:40,max_text_length:40,dropScore:.35,drop_score:.35,useAngleCls:!1,use_angle_cls:!1},session:{executionProviders:x,logSeverityLevel:3,logVerbosityLevel:0,graphOptimizationLevel:"all"},processing:{engine:"canvas-native"}}),await pe.initialize(),pe!=null&&pe.platform&&(pe.platform.createCanvas=($,w)=>{const C=new OffscreenCanvas($,w);return C.getContext("2d",{willReadFrequently:!0}),C}),(l=pe==null?void 0:pe.detector)!=null&&l.platform&&(pe.detector.platform.createCanvas=pe.platform.createCanvas),(d=pe==null?void 0:pe.recognitor)!=null&&d.platform&&(pe.recognitor.platform.createCanvas=pe.platform.createCanvas)}console.log(`[OCR Worker #${u}] ppu-paddle-ocr initialized successfully!`),self.postMessage({type:"READY",workerId:u,detReady:!0,recReady:!0})}catch(_){console.warn(`[OCR Worker #${u}] ppu-paddle-ocr init attempt 1 warning:`,_);try{try{le.wasm.wasmPaths=Fh,le.wasm.numThreads=1}catch{}if(!pe){let y=r&&wr(r)?r:null,b=a&&wr(a)?a:null,x=n&&(n.byteLength>10||n.length>10)?Xa(n):null;if(y||(y=await Yt(Pd)),b||(b=await Yt(Ud)),x||(x=await Yt(Wd,!0)),!y||!b)throw new Error("Không thể tải tệp trọng số ONNX Model PaddleOCR cho chế độ WASM");pe=new Dd({model:{detection:Zt(y),recognition:Zt(b),charactersDictionary:x?Zt(x):void 0},session:{executionProviders:["wasm"],logSeverityLevel:3,logVerbosityLevel:0,graphOptimizationLevel:"all"},processing:{engine:"canvas-native"}}),await pe.initialize(),pe!=null&&pe.platform&&(pe.platform.createCanvas=($,w)=>{const C=new OffscreenCanvas($,w);return C.getContext("2d",{willReadFrequently:!0}),C}),(c=pe==null?void 0:pe.detector)!=null&&c.platform&&(pe.detector.platform.createCanvas=pe.platform.createCanvas),(h=pe==null?void 0:pe.recognitor)!=null&&h.platform&&(pe.recognitor.platform.createCanvas=pe.platform.createCanvas)}self.postMessage({type:"READY",workerId:u,detReady:!0,recReady:!0})}catch(y){console.error(`[OCR Worker #${u}] ppu-paddle-ocr init failed:`,y),self.postMessage({type:"ERROR",workerId:u,error:(y==null?void 0:y.message)||"Worker init error"})}}}else if(t==="PROCESS_BATCH"&&Array.isArray(i))try{const m=[];let _=0;const{sourceLang:y,targetLang:b,enableDeepScan:x=!0}=e.data,$=Md(y)||Md(b);if(self.postMessage({type:"PROGRESS",workerId:u,completed:1,total:i.length,progress:10,message:`Worker #${u}: bóc tách song song ${i.length} khung...`}),pe){let w=null,C=null;for(let S=0;S<i.length;S++){const T=i[S];if(!pe)break;try{let k=null;if(T.pixelData&&T.width&&T.height&&T.width>0&&T.height>0){if(T.pixelData.byteLength===0||T.pixelData.buffer&&T.pixelData.buffer.byteLength===0)continue;let V;if(T.pixelData instanceof Uint8ClampedArray?V=T.pixelData:T.pixelData instanceof ArrayBuffer?V=new Uint8ClampedArray(T.pixelData):T.pixelData&&T.pixelData.buffer instanceof ArrayBuffer?V=new Uint8ClampedArray(T.pixelData.buffer,T.pixelData.byteOffset||0,T.pixelData.length||T.width*T.height*4):V=new Uint8ClampedArray(T.pixelData),typeof OffscreenCanvas<"u"&&((!w||w.width!==T.width||w.height!==T.height)&&(w=new OffscreenCanvas(T.width,T.height),C=w.getContext("2d",{willReadFrequently:!0})),C&&w)){const F=new ImageData(V,T.width,T.height);C.putImageData(F,0,0),k=await pe.recognize(w,{flatten:!0})}}else if(T.image&&typeof T.image=="string"&&T.image.length>30){const V=D0(T.image);V&&V.byteLength>100&&(k=await pe.recognize(V,{flatten:!0}))}else T.image&&T.image instanceof ArrayBuffer&&T.image.byteLength>100&&(k=await pe.recognize(T.image,{flatten:!0}));let A=typeof k=="string"?k:(k==null?void 0:k.text)||"",z=typeof k=="object"&&k?k.confidence??k.score??.88:.88,O=Nd(A,$);if((!O||O.length===0||z<.35)&&x&&C&&w&&T.width&&T.height)try{k0(C,T.width,T.height,1.6,1);const V=await pe.recognize(w,{flatten:!0,dropScore:.15,scoreThresh:.15}),F=typeof V=="string"?V:(V==null?void 0:V.text)||"",U=typeof V=="object"&&V?V.confidence??V.score??.7:.7,K=Nd(F,$);K&&K.length>0&&U>=.18&&(O=K,z=U,console.log(`[DeepScan Tầng-2] Khôi phục phụ đề mờ tại ${T.timestamp}s: "${O}" (${Math.round(z*100)}%)`))}catch{}const W=.2;O&&z>=W&&A0(O,z,W,!1)&&m.push({timestamp:T.timestamp,text:O,confidence:z})}catch(k){console.warn(`[OCR Worker #${u}] Frame recognition exception for timestamp ${T.timestamp}:`,k)}}}self.postMessage({type:"BATCH_COMPLETE",workerId:u,results:m,skippedFramesCount:_})}catch(m){self.postMessage({type:"ERROR",workerId:u,error:(m==null?void 0:m.message)||"Worker batch error"})}}
