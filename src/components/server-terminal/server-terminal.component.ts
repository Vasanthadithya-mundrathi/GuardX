import { Component, ChangeDetectionStrategy, signal, WritableSignal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WafService } from '../../services/waf.service';

interface TerminalOutput {
  command?: string;
  response: string;
  isCommand: boolean;
}

@Component({
  selector: 'app-server-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './server-terminal.component.html',
  styleUrls: ['./server-terminal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerTerminalComponent implements AfterViewChecked {
  @ViewChild('terminalOutput') private terminalOutput: ElementRef;
  private wafService = inject(WafService);

  currentCommand = signal('');
  output: WritableSignal<TerminalOutput[]> = signal([]);

  private readonly initialMessage = `
GuardX Secure Server Environment (v1.2.0)
Last login: ${new Date().toUTCString()} from 192.168.1.10
------------------------------------------------------------------
This is a restricted and monitored environment.
Direct external scanning (e.g., nmap from the internet) is blocked by network ACLs.
Use this terminal for authorized diagnostics.
Type 'help' for a list of available commands.
------------------------------------------------------------------
  `;

  constructor() {
    this.output.set([{ response: this.initialMessage, isCommand: false }]);
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  private scrollToBottom(): void {
    try {
      this.terminalOutput.nativeElement.scrollTop = this.terminalOutput.nativeElement.scrollHeight;
    } catch(err) { } 
  }

  handleCommand() {
    const command = this.currentCommand().trim().toLowerCase();
    if (!command) return;

    const commandOutput: TerminalOutput = { command: command, response: '', isCommand: true };
    this.output.update(o => [...o, commandOutput]);
    
    let responseText = '';
    const parts = command.split(' ');
    const baseCommand = parts[0];

    switch (baseCommand) {
      case 'help':
        responseText = `
  GuardX Server Terminal - Available Commands:
  -------------------------------------------
  help          - Show this help message.
  status        - Display current WAF and server status.
  nmap localhost- Simulate a port scan on this server.
  curl <path>   - Simulate a request to an endpoint (e.g., curl /reviews).
  clear         - Clear the terminal screen.

  To simulate external attacks (e.g., from sqlmap, Burp Suite):
  1. Generate the malicious payload in your tool of choice.
  2. Navigate to the 'Attacker Tools' page in this application.
  3. Paste the payload into the 'Manual Attack' tool and launch.
        `;
        break;

      case 'status':
        const firewallStatus = this.wafService.firewallEnabled() ? 'ACTIVE' : 'DISABLED';
        const securityLevel = this.wafService.securityLevel();
        responseText = `
  GuardX WAF Status:
    Firewall...: ${firewallStatus}
    Security...: ${securityLevel}
    Rules Active: ${this.wafService.stats().adaptiveRules + 4} (4 static, ${this.wafService.stats().adaptiveRules} adaptive)
    Uptime.....: ${this.wafService.stats().uptime}

  Server Status:
    CPU Load...: 15.2%
    Memory.....: 4.8GiB / 16.0GiB
    Public IP..: 45.79.124.118 (simulated)
    Domain.....: sim.guardx.io
        `;
        break;

      case 'nmap':
        if (parts[1] === 'localhost') {
            responseText = `
  Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toISOString()}
  Nmap scan report for sim.guardx.io (localhost)
  Host is up (0.00010s latency).
  Not shown: 998 filtered tcp ports (no-response)
  PORT    STATE   SERVICE
  80/tcp  open    http      (Protected by GuardX WAF)
  443/tcp open    https     (Protected by GuardX WAF)
  
  Nmap done: 1 IP address (1 host up) scanned in 2.58 seconds.
            `;
        } else {
            responseText = "Error: nmap target must be 'localhost'. External scanning is disabled.";
        }
        break;
        
      case 'curl':
        responseText = `Simulating request to ${parts[1] || '/'}.
To send a real payload, please use the 'Attacker Tools' page. This command is for demonstration only.`;
        break;

      case 'clear':
        this.output.set([]);
        break;

      default:
        responseText = `command not found: ${command}`;
        break;
    }

    this.output.update(o => [...o, { response: responseText, isCommand: false }]);
    this.currentCommand.set('');
  }
}
