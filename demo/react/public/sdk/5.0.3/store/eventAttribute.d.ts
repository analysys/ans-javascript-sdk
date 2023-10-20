export declare const eventAttribute: {
    startup: {
        state: boolean;
        xwhen: number;
    };
    pageview: {
        xwhen: number;
        state: {};
        prevPath: string;
        path: string;
    };
    webstay: {
        xwhen: number;
    };
    isUnload: boolean;
    eventCallback: {};
    pageClose: {
        hideTime: number;
        hideStartTime: number;
    };
    timeEvent: {};
};
export declare function implementEventCallback(data: any): void;
//# sourceMappingURL=eventAttribute.d.ts.map