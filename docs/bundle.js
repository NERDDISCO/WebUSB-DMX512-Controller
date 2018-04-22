!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return r});class r{constructor(e={}){this.device=e.device||void 0,this.filters=e.filters||[{vendorId:9025,productId:32822},{vendorId:9025,productId:54},{vendorId:10755,productId:32822},{vendorId:10755,productId:54},{vendorId:10755,productId:64},{vendorId:10755,productId:32832}],this.universe=e.universe||new Array(512).fill(0)}enable(){return navigator.usb.requestDevice({filters:this.filters}).then(e=>{this.device=e})}getPairedDevice(){return navigator.usb.getDevices().then(e=>e[0])}autoConnect(){return this.getPairedDevice().then(e=>(this.device=e,new Promise((e,t)=>void 0===this.device?t(new Error("Can not find USB device.")):e(this.connect()))))}connect(){return this.device.open().then(()=>{if(null===this.device.configuration)return this.device.selectConfiguration(1)}).then(()=>this.device.claimInterface(2)).then(()=>this.device.controlTransferOut({requestType:"class",recipient:"interface",request:34,value:1,index:2})).catch(e=>console.log(e))}send(e){return new Promise((t,n)=>{if(void 0===this.device)return n(new Error("USB device is not connected to the computer"));{const n=Uint8Array.from(e);return t(this.device.transferOut(4,n))}})}updateUniverse(e,t){return new Promise((n,r)=>{if(e-=1,Number.isInteger(t))this.universe.splice(e,1,t);else{if(!Array.isArray(t))return r(new Error("Could not update Universe because the provided value is not of type Integer or Array"));this.universe.splice(e,t.length,...t)}return n(this.send(this.universe))})}disconnect(){return this.device.controlTransferOut({requestType:"class",recipient:"interface",request:34,value:1,index:2}).then(()=>this.device.close())}}},function(e,t,n){"use strict";n.r(t);var r=n(0);const o=new r.default,i=new class{constructor(){this.output=document.getElementById("console")}log(e,t,n){let r="";switch(n){case"USBDevice":r=`${e}: ${t}`;break;case"array":r=e+JSON.stringify(t);break;case"keyvalue":r=`${e}: ${t}`;break;default:r=e+" "+t}console.log(r),this.output.value+=r+"\n",this.output.scrollTop=this.output.scrollHeight}},c=document.getElementById("activateWebUsb"),s=document.getElementById("disconnectWebUsb"),a=document.getElementById("updateAnyChannel"),u=document.getElementById("logUniverse");let l=!1;const d=document.getElementById("changeColor"),v=document.getElementById("changeDimmer"),g=document.getElementById("changeUv"),h=document.getElementById("changeStrobe"),p=e=>{i.log("---","","string"),i.log("Selected device",e.productName,"USBDevice"),i.log("---","","string");const{configuration:t,configurations:n,deviceClass:r,deviceProtocol:o,deviceSubclass:c,deviceVersionMajor:s,deviceVersionMinor:a,deviceVersionSubminor:u,manufacturerName:l,opened:d,productId:v,productName:g,serialNumber:h,usbVersionMajor:p,usbVersionMinor:f,usbVersionSubminor:m,vendorId:y}=e;i.log("Opened",d,"keyvalue"),i.log("Vendor ID",y,"keyvalue"),i.log("Manufacturer Name",l,"keyvalue"),i.log("Product ID",v,"keyvalue"),i.log("Product Name",g,"keyvalue"),i.log("Serialnumber",h,"keyvalue"),i.log("Device Class",r,"keyvalue"),i.log("Device Protocol",o,"keyvalue"),i.log("Device Subclass",c,"keyvalue"),i.log("Device Version Major",s,"keyvalue"),i.log("Device Version Minor",a,"keyvalue"),i.log("Device Version Subminor",u,"keyvalue"),i.log("USB Version Major",p,"keyvalue"),i.log("USB Version Minor",f,"keyvalue"),i.log("USB Version Subminor",m,"keyvalue")},f=()=>{l&&i.log("",o.universe,"array")};c.addEventListener("click",e=>{o.enable().then(()=>{o.connect().then(()=>{p(o.device)})}).catch(()=>{i.log("No USB device was selected","","string")})}),s.addEventListener("click",e=>{o.disconnect().then(()=>{i.log("Destroyed connection to USB device, but USB device is still paired with the browser","","string")})}),o.autoConnect().then(()=>{i.log("Found an already paired USB device","","string"),p(o.device)}).catch(e=>{i.log("autoConnect:",e,"string")}),a.addEventListener("submit",e=>{e.preventDefault();const t=new FormData(a),n=parseInt(t.get("channel"),10),r=parseInt(t.get("value"),10);i.log("---","","string"),i.log(`Set Channel ${n} to ${r}`,"","string"),o.updateUniverse(n,r).then(()=>{f()}).catch(e=>{i.log(e,"","string")})}),u.addEventListener("change",e=>{const{target:t}=e;l=t.checked}),d.addEventListener("change",e=>{let t=e.target.value.match(/[A-Za-z0-9]{2}/g).map(e=>parseInt(e,16));i.log("---","","string"),i.log(`Set Color on Channel 1 - 3 to ${t}`,"","string"),o.updateUniverse(1,t).then(()=>{f()}).catch(e=>{i.log(e,"","string")})}),g.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set UV on Channel 4 to ${t}`,"","string"),o.updateUniverse(4,t).then(()=>{f()}).catch(e=>{i.log(e,"","string")})}),v.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set Dimmer on Channel 5 to ${t}`,"","string"),o.updateUniverse(5,t).then(()=>{f()}).catch(e=>{i.log(e,"","string")})}),h.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set Strobe on Channel 6 to ${t}`,"","string"),o.updateUniverse(6,t).then(()=>{f()}).catch(e=>{i.log(e,"","string")})})}])});
//# sourceMappingURL=bundle.js.map