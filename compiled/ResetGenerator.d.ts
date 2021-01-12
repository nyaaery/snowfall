import { UniqueGenerator } from "./UniqueGenerator";
export declare class ResetGenerator extends UniqueGenerator {
    #private;
    protected generation_loop(): Promise<void>;
}
