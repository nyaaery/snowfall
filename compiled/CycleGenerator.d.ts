import { UniqueGenerator } from "./UniqueGenerator";
export declare class CycleGenerator extends UniqueGenerator {
    #private;
    protected generation_loop(): Promise<void>;
}
