import com.mongodb.client.MongoCollection;

import com.mongodb.client.MongoDatabase;

import com.sun.net.httpserver.HttpExchange;

import com.sun.net.httpserver.HttpHandler;

import org.bson.Document;

import org.json.JSONObject;

import java.io.IOException;

import java.io.InputStream;

import java.io.OutputStream;

import java.nio.charset.StandardCharsets;

public class LoginHandler
implements HttpHandler {

    @Override

    public void handle(
        HttpExchange exchange
    ) throws IOException {

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

        // Only allow POST requests
        if (
            !exchange.getRequestMethod()
            .equalsIgnoreCase("POST")
        ) {

            String error =
                "{\"success\":false,\"message\":\"Method not allowed\"}";

            byte[] errorBytes = error.getBytes();

            exchange.getResponseHeaders().add(
                "Content-Type",
                "application/json"
            );

            exchange.sendResponseHeaders(
                405,
                errorBytes.length
            );

            OutputStream os =
                exchange.getResponseBody();

            os.write(errorBytes);

            os.close();

            return;
        }

        try {

        InputStream inputStream =
            exchange.getRequestBody();

        String body =
            new String(
                inputStream.readAllBytes(),
                StandardCharsets.UTF_8
            );

        JSONObject json =
            new JSONObject(body);

        String email =
            json.optString("email", "").trim();

        String password =
            json.optString("password", "").trim();

        // Validate required fields
        if (
            email.isEmpty() ||
            password.isEmpty()
        ) {

            String response =
                "{\"success\":false,\"message\":\"Email and password are required\"}";

            sendResponse(exchange, 400, response);

            return;
        }

        MongoDatabase database =
            MongoDB.connect();

        MongoCollection<Document>
            collection =
            database.getCollection("users");

        Document user =
            collection.find(
                new Document(
                    "email",
                    email
                ).append(
                    "password",
                    password
                )
            ).first();

        String response;

        if (user != null) {

            // Return user name and email on success
            String userName =
                user.getString("name");

            if (userName == null) {
                userName = "";
            }

            response =
                "{\"success\":true,\"message\":\"Login Successful\"" +
                ",\"name\":\"" + userName.replace("\"", "\\\"") + "\"" +
                ",\"email\":\"" + email.replace("\"", "\\\"") + "\"}";

        } else {

            response =
                "{\"success\":false,\"message\":\"Invalid Credentials\"}";
        }

        sendResponse(exchange, 200, response);

        } catch (Exception e) {

            String error =
                "{\"success\":false,\"message\":\"Server error: " +
                e.getMessage() + "\"}";

            exchange.getResponseHeaders().add(
                "Content-Type",
                "application/json"
            );

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

    private void sendResponse(
        HttpExchange exchange,
        int statusCode,
        String response
    ) throws IOException {

        exchange.getResponseHeaders().add(
            "Content-Type",
            "application/json"
        );

        byte[] responseBytes =
            response.getBytes();

        exchange.sendResponseHeaders(
            statusCode,
            responseBytes.length
        );

        OutputStream output =
            exchange.getResponseBody();

        output.write(
            responseBytes
        );

        output.close();
    }
}