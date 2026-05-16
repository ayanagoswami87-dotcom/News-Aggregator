import com.mongodb.client.MongoClient;

import com.mongodb.client.MongoClients;

import com.mongodb.client.MongoDatabase;

public class MongoDB {

    private static final String URL =
        "mongodb://localhost:27017";

    private static final String DB_NAME =
        "newsAggregatorDB";

    public static MongoDatabase connect() {

        MongoClient client =
            MongoClients.create(URL);

        MongoDatabase database =
            client.getDatabase(DB_NAME);

        System.out.println(
            "MongoDB Connected"
        );

        return database;
    }
}