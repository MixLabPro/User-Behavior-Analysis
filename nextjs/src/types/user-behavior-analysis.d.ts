declare module 'user-behavior-analysis' {
  interface UserBehaviorConfig {
    sendUrl?: string;
    appId?: string;
    userId?: string;
    debug?: boolean;
    autoSendEvents?: boolean;
    clicks?: boolean;
    mouseScroll?: boolean;
    formInteractions?: boolean;
    processData?: (results: any) => void;
  }

  interface UserBehaviorAPI {
    config: (config: UserBehaviorConfig) => void;
    start: () => void;
    stop: () => void;
    processResults: () => void;
  }

  const userBehavior: UserBehaviorAPI;
  export default userBehavior;
}
