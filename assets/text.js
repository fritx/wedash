export default `
Security Options

By default, GoTTY doesn't allow clients to send any keystrokes or commands except terminal window resizing. When you want to permit clients to write input to the TTY, add the -w option. However, accepting input from remote clients is dangerous for most commands. When you need interaction with the TTY for some reasons, consider starting GoTTY with tmux or GNU Screen and run your command on it (see "Sharing with Multiple Clients" section for detail).

To restrict client access, you can use the -c option to enable the basic authentication. With this option, clients need to input the specified username and password to connect to the GoTTY server. Note that the credentical will be transmitted between the server and clients in plain text. For more strict authentication, consider the SSL/TLS client certificate authentication described below.

The -r option is a little bit casualer way to restrict access. With this option, GoTTY generates a random URL so that only people who know the URL can get access to the server.

All traffic between the server and clients are NOT encrypted by default. When you send secret information through GoTTY, we strongly recommend you use the -t option which enables TLS/SSL on the session. By default, GoTTY loads the crt and key files placed at ~/.gotty.crt and ~/.gotty.key. You can overwrite these file paths with the --tls-crt and --tls-key options. When you need to generate a self-signed certification file, you can use the openssl command.

openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout ~/.gotty.key -out ~/.gotty.crt
`
