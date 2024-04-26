"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePrivacyInfo = exports.setPrivacyInfo = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const plist_1 = __importDefault(require("@expo/plist"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function setPrivacyInfo(projectConfig, privacyManifests) {
    const { projectRoot, platformProjectRoot } = projectConfig.modRequest;
    const projectName = config_plugins_1.XcodeProject.getProjectName(projectRoot);
    const privacyFilePath = path.join(platformProjectRoot, projectName, "PrivacyInfo.xcprivacy");
    const existingFileContent = getFileContents(privacyFilePath);
    const parsedContent = existingFileContent
        ? plist_1.default.parse(existingFileContent)
        : {};
    const mergedContent = mergePrivacyInfo(parsedContent, privacyManifests);
    const contents = plist_1.default.build(mergedContent);
    ensureFileExists(privacyFilePath, contents);
    if (!projectConfig.modResults.hasFile(privacyFilePath)) {
        projectConfig.modResults = config_plugins_1.XcodeProject.addResourceFileToGroup({
            filepath: path.join(projectName, "PrivacyInfo.xcprivacy"),
            groupName: projectName,
            project: projectConfig.modResults,
            isBuildFile: true,
            verbose: true,
        });
    }
    return projectConfig;
}
exports.setPrivacyInfo = setPrivacyInfo;
function getFileContents(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return fs.readFileSync(filePath, { encoding: "utf8" });
}
function ensureFileExists(filePath, contents) {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, contents);
}
function mergePrivacyInfo(existing, privacyManifests) {
    let { NSPrivacyAccessedAPITypes = [], NSPrivacyCollectedDataTypes = [], NSPrivacyTracking = false, NSPrivacyTrackingDomains = [], } = structuredClone(existing);
    // tracking is a boolean, so we can just overwrite it
    NSPrivacyTracking =
        privacyManifests.NSPrivacyTracking ?? existing.NSPrivacyTracking ?? false;
    // merge the api types – for each type ensure the key is in the array, and if it is add the reason if it's not there
    privacyManifests.NSPrivacyAccessedAPITypes?.forEach((newType) => {
        const existingType = NSPrivacyAccessedAPITypes.find((t) => t.NSPrivacyAccessedAPIType === newType.NSPrivacyAccessedAPIType);
        if (!existingType) {
            NSPrivacyAccessedAPITypes.push(newType);
        }
        else {
            existingType.NSPrivacyAccessedAPITypeReasons = [
                ...new Set(existingType?.NSPrivacyAccessedAPITypeReasons?.concat(...newType.NSPrivacyAccessedAPITypeReasons)),
            ];
        }
    });
    // merge the collected data types – for each type ensure the key is in the array, and if it is add the purposes if it's not there
    privacyManifests.NSPrivacyCollectedDataTypes?.forEach((newType) => {
        const existingType = NSPrivacyCollectedDataTypes.find((t) => t.NSPrivacyCollectedDataType === newType.NSPrivacyCollectedDataType);
        if (!existingType) {
            NSPrivacyCollectedDataTypes.push(newType);
        }
        else {
            existingType.NSPrivacyCollectedDataTypePurposes = [
                ...new Set(existingType?.NSPrivacyCollectedDataTypePurposes?.concat(...newType.NSPrivacyCollectedDataTypePurposes)),
            ];
        }
    });
    // merge the tracking domains
    NSPrivacyTrackingDomains = [
        ...new Set(NSPrivacyTrackingDomains.concat(privacyManifests.NSPrivacyTrackingDomains ?? [])),
    ];
    return {
        NSPrivacyAccessedAPITypes,
        NSPrivacyCollectedDataTypes,
        NSPrivacyTracking,
        NSPrivacyTrackingDomains,
    };
}
exports.mergePrivacyInfo = mergePrivacyInfo;
const withExpoPrivacyManifestPolyfillPlugin = (config, _props = {}) => {
    const privacyManifests = config.ios?.privacyManifests;
    if (!privacyManifests) {
        return config;
    }
    return (0, config_plugins_1.withXcodeProject)(config, (projectConfig) => {
        return setPrivacyInfo(projectConfig, privacyManifests);
    });
};
exports.default = withExpoPrivacyManifestPolyfillPlugin;
