import { supabase } from '../../services/supabase';

export class TestLogger {
  private static results: {
    component: string;
    test: string;
    status: 'pass' | 'fail';
    error?: string;
  }[] = [];

  static async logTest(component: string, test: string, callback: () => Promise<void>) {
    try {
      await callback();
      this.results.push({ component, test, status: 'pass' });
      console.log(`✅ ${component} - ${test}`);
    } catch (err) {
      this.results.push({ 
        component, 
        test, 
        status: 'fail', 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
      console.error(`❌ ${component} - ${test}:`, err);
    }
  }

  static getSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'pass').length;
    return {
      total,
      passed,
      failed: total - passed,
      results: this.results
    };
  }
}