import { ConfigPlugin, XcodeProject, ExportedConfigWithProps } from "@expo/config-plugins";
export type PrivacyInfo = {
    NSPrivacyAccessedAPITypes: {
        NSPrivacyAccessedAPIType: string;
        NSPrivacyAccessedAPITypeReasons: string[];
    }[];
    NSPrivacyCollectedDataTypes: {
        NSPrivacyCollectedDataType: string;
        NSPrivacyCollectedDataTypeLinked: boolean;
        NSPrivacyCollectedDataTypeTracking: boolean;
        NSPrivacyCollectedDataTypePurposes: string[];
    }[];
    NSPrivacyTracking: boolean;
    NSPrivacyTrackingDomains: string[];
};
export declare function setPrivacyInfo(projectConfig: ExportedConfigWithProps<XcodeProject>, privacyManifests: Partial<PrivacyInfo>): ExportedConfigWithProps<XcodeProject>;
export declare function mergePrivacyInfo(existing: Partial<PrivacyInfo>, privacyManifests: Partial<PrivacyInfo>): PrivacyInfo;
declare const withExpoPrivacyManifestPolyfillPlugin: ConfigPlugin<{} | void>;
export default withExpoPrivacyManifestPolyfillPlugin;
