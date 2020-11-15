package com.example.accessingdataneo4j;

import org.neo4j.driver.*;
import static org.neo4j.driver.Values.parameters;

public class GraphDBTransactions implements AutoCloseable{

    private final Driver driver;

    public GraphDBTransactions(String uri, String user, String password )
    {
        driver = GraphDatabase.driver( uri, AuthTokens.basic( user, password ) );
    }

    @Override
    public void close() throws Exception
    {
        driver.close();
    }

    //CREATE a new node
    public void create(int id, String name)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "CREATE (a:Person) " +
                                    "SET a.id = $id, a.name = $name " +
                                    "RETURN a.id, a.name + ', from node ' + id(a)",
                            parameters( "name", name , "id", id) );
                    return result.single().get( 1 ).asString();
                }
            } );
            System.out.println("Person added -> ID: " + id + " name: " + person);
        }
    }

    //DELETES a node and all relationships of it
    public void delete(int id)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (n:Person { id: $id })" +
                                    "DETACH DELETE n",
                            parameters( "id", id ) );
                    return "deleted";
                }
            } );
            System.out.println("Person deleted -> ID: " + id);
        }
    }

    // CREATE a following between two people.
    public void follows(int id1, int id2)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id1}) " +
                                                   "MATCH (b:Person {id: $id2}) " +
                                                   "MERGE (a)-[:FOLLOWS]->(b)",
                            parameters( "id1", id1, "id2", id2 ) );
                    return "ok";
                }
            } );
            System.out.println(id1 + " follows " + id2);
        }
    }

    //DELETE all nodes
    public void emptyDB(){
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (n) DETACH DELETE n");
                    return "ok";
                }
            } );
            System.out.println("All nodes deleted.");
        }
    }
}