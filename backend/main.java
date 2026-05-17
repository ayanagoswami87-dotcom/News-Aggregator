import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;

import java.net.InetSocketAddress;
import java.net.URI;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;

import java.net.http.HttpResponse;

public class Main {

    // PUT YOUR GNEWS API KEY HERE
    static final String API_KEY = "5dabd041937d8a6936955e9ace163bd8";


    public static void main(String[] args)
            throws Exception {

        // CREATE SERVER
        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8000),
                        0
                );

        // CREATE ROUTES
        server.createContext(
                "/news",
                new NewsHandler()
        );

        server.createContext(
                "/login",
                new LoginHandler()
        );

        server.createContext(
                "/signup",
                new SignupHandler()
        );

        server.createContext(
                "/comment",
                new CommentHandler()
        );

        server.setExecutor(null);

        server.start();

        System.out.println(
                "Server running on http://localhost:8000"
        );
    }

    static class NewsHandler
            implements HttpHandler {

        @Override
        public void handle(
                HttpExchange exchange
        ) throws IOException {

            // CORS HEADERS
            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Origin",
                    "*"
            );

            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Headers",
                    "Content-Type"
            );

            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Methods",
                    "GET, POST, OPTIONS"
            );

            if (
                exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")
            ) {

                exchange.sendResponseHeaders(
                    204,
                    -1
                );

                return;
            }

            try {

                // GNEWS API URL
                String apiUrl = 
                             "https://gnews.io/api/v4/top-headlines"
                             + "?category=general"
                             + "&lang=en"
                             + "&country=in"
                             + "&max=10"
                            + "&apikey=" + API_KEY;
                // HTTP CLIENT
               HttpClient client =
        HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

                // HTTP REQUEST
                HttpRequest request =
                        HttpRequest.newBuilder()
                                .uri(
                                        URI.create(apiUrl)
                                )
                                .GET()
                                .build();

                // HTTP RESPONSE
                HttpResponse<String> response =
                        client.send(
                                request,
                                HttpResponse.BodyHandlers.ofString()
                        );

                String json =
                        response.body();

                byte[] jsonBytes = json.getBytes();

                // ALLOW FRONTEND ACCESS
                exchange.getResponseHeaders().add(
                        "Content-Type",
                        "application/json"
                );

                exchange.sendResponseHeaders(
                        200,
                        jsonBytes.length
                );

                OutputStream os =
                        exchange.getResponseBody();

                os.write(jsonBytes);

                os.close();

            } catch (Exception e) {

                String error =
                        "{ \"error\": \"" +
                        e.getMessage() +
                        "\" }";

                byte[] errorBytes = error.getBytes();

                exchange.sendResponseHeaders(
                        500,
                        errorBytes.length
                );

                OutputStream os =
                        exchange.getResponseBody();

                os.write(errorBytes);

                os.close();
            }
        }
    }
}