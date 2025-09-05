(function() {
    'use strict';
    
    const DEBUG_ENABLED = false;
    
    if (!DEBUG_ENABLED) return;
    
    const debugLog = [];
    
    function log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        debugLog.push(logEntry);
        console.log(logEntry);
        
        if (type === 'error' || type === 'warn') {
            showDebugMessage(message, type);
        }
    }
    
    function showDebugMessage(message, type) {
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${type === 'error' ? '#ff4444' : '#ff8800'};
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        debugDiv.textContent = message;
        document.body.appendChild(debugDiv);
        
        setTimeout(() => {
            if (debugDiv.parentNode) {
                debugDiv.parentNode.removeChild(debugDiv);
            }
        }, 5000);
    }
    
    window.addEventListener('load', () => {
        log('Window load event fired');
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        log('DOMContentLoaded event fired');
    });
    
    window.addEventListener('error', (e) => {
        if (e.target !== window) {
            log(`Resource failed to load: ${e.target.src || e.target.href || 'unknown'}`, 'error');
        } else {
            log(`JavaScript error: ${e.message}`, 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        log(`Unhandled promise rejection: ${e.reason}`, 'error');
    });
    
    setTimeout(() => {
        if (typeof AOS === 'undefined') {
            log('AOS library not loaded', 'warn');
        } else {
            log('AOS library loaded successfully');
        }
        
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-test';
        testElement.style.cssText = 'position: absolute; visibility: hidden;';
        document.body.appendChild(testElement);
        
        const computed = window.getComputedStyle(testElement);
        if (computed.fontFamily.indexOf('Font Awesome') === -1) {
            log('Font Awesome not loaded properly', 'warn');
        } else {
            log('Font Awesome loaded successfully');
        }
        
        document.body.removeChild(testElement);
        
    }, 3000);
    
    window.getDebugLogs = function() {
        return debugLog.join('\n');
    };
    
    window.showDebugLogs = function() {
        const logWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (!logWindow) {
            console.error('Não foi possível abrir a janela de debug. Verifique se pop-ups estão bloqueados.');
            return;
        }
        
        const doc = logWindow.document;
        doc.open();
        
        const html = doc.createElement('html');
        html.lang = 'pt-BR';
        
        const head = doc.createElement('head');
        head.innerHTML = `
            <title>Debug Logs - Escola Tia Carla</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    background: #f8f9fa;
                }
                h1 { 
                    color: #003399; 
                    border-bottom: 2px solid #FFCC00;
                    padding-bottom: 10px;
                }
                pre { 
                    background: #ffffff; 
                    padding: 15px; 
                    border-radius: 8px; 
                    overflow: auto;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .buttons {
                    margin: 20px 0;
                }
                button {
                    background: #003399;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin-right: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background: #002266;
                }
            </style>
        `;
        
        const body = doc.createElement('body');
        body.innerHTML = `
            <h1>Debug Logs - Escola Tia Carla</h1>
            <div class="buttons">
                <button onclick="window.print()">📄 Imprimir</button>
                <button onclick="window.close()">❌ Fechar</button>
                <button onclick="location.reload()">🔄 Atualizar</button>
            </div>
            <pre style="font-family: 'Courier New', monospace; white-space: pre-wrap;">${debugLog.join('\n')}</pre>
        `;
        
        html.appendChild(head);
        html.appendChild(body);
        doc.appendChild(html);
        doc.close();
        
        logWindow.focus();
    };
    
    log('Debug system initialized');
})();
