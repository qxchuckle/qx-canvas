import { LifecycleKey } from "./enums";

export type LifecycleHooks = Map<LifecycleKey, Set<Function>>;
