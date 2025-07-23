import { EnvService } from './env.service';

export const EnvServiceFactory = () => {  
  // Create env
  const env = new EnvService();
  
  // Read environment variables from browser window
  const browserWindow:any = window || {};
  const browserWindowEnv = (browserWindow['__env'] as Record<string, any>) || {};
  
  // Assign environment variables from browser window to env
  for (const key in browserWindowEnv) {
    if (browserWindowEnv.hasOwnProperty(key)) {
      env[key] = browserWindowEnv[key]; // Use browserWindowEnv instead of window['__env']
    }
  }
  
  return env;
};

export const EnvServiceProvider = {  
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};