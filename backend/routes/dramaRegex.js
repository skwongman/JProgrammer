// Use regex to verify the user input.
const titleRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,20}$/;
const titleJpRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FBFa-zA-Z0-9\s\u3001\u3002\uFF1F\uFF01\u2026\uFF1B\u300C\u300D\u300E\u300F\u3010\u3011\uFF08\uFF09\uFF1C\uFF1E\uFFE5\uFF1A\u2019\u201D\u3014\u3015\u00B7\uFF01\u0040\uFFE5\u0025\u2026\u0026\uFF0A\uFF09\u2014\u3016\u3017\u007B\u007D\u003B\u0027\u0022\u005B\u005D\u005C\u002C\u002E\u003C\u003E\u002F\u003F\u0040]{1,20}$/;
const categoryRegex = /^[\u4e00-\u9fa5\/]{1,10}$/;
const introductionRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;
const TVRegex = /^[\u4e00-\u9fa5]{1,10}$/;
const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
const weekRegex = /^[\u4e00-\u9fa5]{3}$/;
const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const actorRegex = /^([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10})(,\s([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10}))*$/;
const ratingRegex = /^(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1}))(,\s(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1})))*$/;
const mediaRegex = /^https:\/\/(www\.)?[\w\/\.\-]+$/;
const videoRegex = /^(None|(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32})(,\s(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32}))*)$/;

module.exports = {
    titleRegex,
    titleJpRegex,
    categoryRegex,
    introductionRegex,
    TVRegex,
    dateRegex,
    weekRegex,
    timeRegex,
    actorRegex,
    ratingRegex,
    mediaRegex,
    videoRegex
};