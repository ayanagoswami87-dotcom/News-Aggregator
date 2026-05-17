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

public class SignupHandler
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

        String name =
            json.optString("name", "").trim();

        String email =
            json.optString("email", "").trim();

        String password =
            json.optString("password", "").trim();

        // Validate required fields
        if (
            name.isEmpty() ||
            email.isEmpty() ||
            password.isEmpty()
        ) {

            String response =
                "{\"success\":false,\"message\":\"All fields are required\"}";

            sendResponse(exchange, 400, response);

            return;
        }

        MongoDatabase database =
            MongoDB.connect();

        MongoCollection<Document>
            collection =
            database.getCollection("users");

        // Check for duplicate email
        Document existing =
            collection.find(
                new Document(
                    "email",
                    email
                )
            ).first();

        if (existing != null) {

            String response =
                "{\"success\":false,\"message\":\"Email already registered\"}";

            sendResponse(exchange, 409, response);

            return;
        }

        Document document =
            new Document(
                "name",
                name
            )

            .append(
                "email",
                email
            )

            .append(
                "password",
                password
            );

        collection.insertOne(document);

        String response =
            "{\"success\":true,\"message\":\"Signup Successful\"}";

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