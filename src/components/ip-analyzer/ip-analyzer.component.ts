import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WafService } from '../../services/waf.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ip-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ip-analyzer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IpAnalyzerComponent {
  wafService = inject(WafService);
  ip = signal<string>('203.0.113.112');
  
  isLoading = this.wafService.isLoadingIpAnalysis;
  analysisResult = this.wafService.ipAnalysisResult;
  analysisError = this.wafService.ipAnalysisError;

  exampleIPs = ['8.8.8.8', '198.51.100.14', '1.1.1.1'];

  analyzeIp() {
    if (this.ip().trim()) {
      this.wafService.analyzeIp(this.ip());
    }
  }

  useExample(example: string) {
    this.ip.set(example);
    this.analyzeIp();
  }

  getRiskColor(score: number): string {
    if (score > 75) return 'text-red-400';
    if (score > 50) return 'text-orange-400';
    if (score > 25) return 'text-yellow-400';
    return 'text-green-400';
  }
}
