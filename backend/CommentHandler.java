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

public class CommentHandler
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

        MongoDatabase database =
            MongoDB.connect();

        MongoCollection<Document>
            collection =
            database.getCollection("comments");

        Document document =
            new Document(
                "newsTitle",
                json.getString(
                    "newsTitle"
                )
            )

            .append(
                "comment",
                json.getString(
                    "comment"
                )
            );

        collection.insertOne(document);

        String response =
            "{\"message\":\"Comment Saved\"}";

        exchange.getResponseHeaders().add(
            "Content-Type",
            "application/json"
        );

        byte[] responseBytes =
            response.getBytes();

        exchange.sendResponseHeaders(
            200,
            responseBytes.length
        );

        OutputStream output =
            exchange.getResponseBody();

        output.write(
            responseBytes
        );

        output.close();

        } catch (Exception e) {

            String error =
                "{\"message\":\"Server error: " +
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
}