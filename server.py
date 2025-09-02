#!/usr/bin/env python3
"""
Simple HTTP server for the Phonebook application
"""

import http.server
import socketserver
import os
import webbrowser
import threading
import time

# Configuration
PORT = 8001  # Changed from 8000 to 8001
HOST = "localhost"

class PhonebookHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the phonebook application"""
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.address_string()}] {format % args}")

def start_server():
    """Start the HTTP server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer((HOST, PORT), PhonebookHTTPRequestHandler) as httpd:
        print(f"\n{'='*50}")
        print(f"📞 Phonebook Server Started")
        print(f"{'='*50}")
        print(f"Server running at: http://{HOST}:{PORT}")
        print(f"Press Ctrl+C to stop the server")
        print(f"{'='*50}\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nShutting down server...")
            httpd.shutdown()

def open_browser():
    """Open browser after a short delay"""
    time.sleep(1.5)
    url = f"http://{HOST}:{PORT}"
    try:
        webbrowser.open(url)
        print(f"✅ Browser opened automatically at {url}")
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print(f"   Please manually navigate to: {url}")

if __name__ == "__main__":
    # Start browser in a separate thread
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # Start the server
    start_server()

