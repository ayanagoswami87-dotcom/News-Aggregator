import com.mongodb.client.MongoClient;

import com.mongodb.client.MongoClients;

import com.mongodb.client.MongoDatabase;

public class MongoDB {

    private static final String URL =
        "mongodb://localhost:27017";

    private static final String DB_NAME =
        "newsAggregatorDB";

    private static MongoClient client = null;

    public static MongoDatabase connect() {

        if (client == null) {

            client =
                MongoClients.create(URL);

            System.out.println(
                "MongoDB Connected"
            );
        }

        return client.getDatabase(DB_NAME);
    }
}