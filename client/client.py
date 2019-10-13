# standard library in python3
import socket


# this application work as client. should send the first request to the server.
def client_program():
    # this must be the server IP and port. at now, it is same to both programs.
    host = socket.gethostbyname(socket.gethostname())
    port = 5000

    # initialize socket object instance
    client_socket = socket.socket()
    # connect to the server. server gets values for accept method after this one executed.
    client_socket.connect((host, port))

    # this is the starting message.
    message = input(" -> ")

    # run the loop until say "bye" by the client
    while message.lower().strip() != 'bye':
        # client sends message.
        client_socket.send(message.encode())
        # client receives the response from the server.
        data = client_socket.recv(1024).decode()

        print('Received from server: ' + data)

        # next message by the client
        message = input(" -> ")

    # after client said "bye", close the client side connection. it will return an empty request to the server.
    # then the loop in server will end and close it's connection too.
    client_socket.close()


if __name__ == '__main__':
    client_program()
