# server.py
import http.server
import ssl
import socketserver

PORT = 8080

Handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(("", PORT), Handler)

# Configuration SSL
httpd.socket = ssl.wrap_socket(httpd.socket, 
                                certfile='cert.pem', 
                                keyfile='key.pem', 
                                server_side=True)

print(f"Serveur HTTPS démarré sur le port {PORT}")
httpd.serve_forever()