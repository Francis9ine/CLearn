// Single place to swap the code-execution backend.
export const EXEC_CONFIG = {
  // 'auto' = try Judge0 first, fall back to mock if unreachable. 'mock' forces mock mode.
  mode: 'auto' as 'auto' | 'mock' | 'judge0',
  endpoint: 'https://ce.judge0.com',
  headers: {} as Record<string, string>, // e.g. { 'X-RapidAPI-Key': '...' } for a hosted plan
  languageId: 50, // C (GCC 9.2.0) on Judge0 CE
  timeoutMs: 15000,
}
