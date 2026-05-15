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
    static final String API_KEY = "ed2f7aec665595d63a813ada95c7014d";


    public static void main(String[] args)
            throws Exception {

        // CREATE SERVER
        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        // CREATE ROUTE
        server.createContext(
                "/news",
                new NewsHandler()
        );

        server.setExecutor(null);

        server.start();

        System.out.println(
                "Server running on http://localhost:8080"
        );
    }

    static class NewsHandler
            implements HttpHandler {

        @Override
        public void handle(
                HttpExchange exchange
        ) throws IOException {

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

                // ALLOW FRONTEND ACCESS
                exchange.getResponseHeaders().add(
                        "Access-Control-Allow-Origin",
                        "*"
                );

                exchange.getResponseHeaders().add(
                        "Content-Type",
                        "application/json"
                );

                exchange.sendResponseHeaders(
                        200,
                        json.length()
                );

                OutputStream os =
                        exchange.getResponseBody();

                os.write(json.getBytes());

                os.close();

            } catch (Exception e) {

                String error =
                        "{ \"error\": \"" +
                        e.getMessage() +
                        "\" }";

                exchange.sendResponseHeaders(
                        500,
                        error.length()
                );

                OutputStream os =
                        exchange.getResponseBody();

                os.write(error.getBytes());

                os.close();
            }
        }
    }
}