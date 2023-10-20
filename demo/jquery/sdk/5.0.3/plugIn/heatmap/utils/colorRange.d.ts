export function resetGradient(max: any, min: any): {};
export default ColorRangeMaker;
declare function ColorRangeMaker(option: any): void;
declare class ColorRangeMaker {
    constructor(option: any);
    option: {
        vRange: number;
        rA: number;
        gA: number;
        bA: number;
        option: any;
        makers?: undefined;
        vA?: undefined;
    } | {
        makers: ColorRangeMaker[];
        vA: number;
        option: any;
        vRange?: undefined;
        rA?: undefined;
        gA?: undefined;
        bA?: undefined;
    };
    make(value: any): any;
}
//# sourceMappingURL=colorRange.d.ts.map