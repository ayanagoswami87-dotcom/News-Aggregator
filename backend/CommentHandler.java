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

        exchange.sendResponseHeaders(
            200,
            response.length()
        );

        OutputStream output =
            exchange.getResponseBody();

        output.write(
            response.getBytes()
        );

        output.close();
    }
}