#!/usr/bin/env python3
"""
Servidor HTTP simples para desenvolvimento local
Use: python server.py
"""

import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.address_string()}] {format % args}")

def main():
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n{'='*60}")
        print(f"🚀 Servidor Datashield TI rodando em http://localhost:{PORT}")
        print(f"{'='*60}\n")
        print("Pressione Ctrl+C para parar o servidor\n")
        
        # Abrir no navegador automaticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor interrompido pelo usuário.")
            httpd.shutdown()

if __name__ == "__main__":
    main()

