package com.example.accessingdataneo4j;

import org.neo4j.driver.*;
import java.util.ArrayList;
import java.util.List;
import static org.neo4j.driver.Values.parameters;

public class GraphDBTransactions implements AutoCloseable{

    private static final String URI = "bolt://localhost:7687";
    private static final String USER = "neo4j";
    private static final String PASSWORD = "secret";
    private final Driver driver = GraphDatabase.driver( URI, AuthTokens.basic( USER, PASSWORD ) );

    @Override
    public void close() {
        driver.close();
    }

    //GET all persons of database
    public List<Person> getAllPersons(){
        Session session = driver.session();
        List<Person> allPersons = new ArrayList<>();
        allPersons = session.readTransaction(new TransactionWork<List<Person>>(){
                @Override
                public List<Person> execute(Transaction tx)
                {
                    List<Person> persons = new ArrayList<Person>();
                    Result result = tx.run(  "MATCH (p:Person)" +
                                                    "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                                                    "RETURN p.id, p.name, collect(p2.id) as follows");
                        while (result.hasNext()){
                            Record r = result.next();
                            int id = r.get("p.id").asInt();
                            String name = r.get("p.name").asString();
                            List follows = r.get("follows").asList();
                            ArrayList<String> followsPerson = new ArrayList<>();

                            for(Object f : follows){
                                followsPerson.add(follows.toString());
                            }
                            persons.add(new Person(id, name, follows));
                         }
                        return persons;
                 }
        });
        return allPersons;
    }

    //GET a person by id
    public Person getPersonById(int id){
        Session session = driver.session();
        Person personById;
        personById = session.readTransaction(new TransactionWork<Person>(){
            @Override
            public Person execute(Transaction tx)
            {
                Result result = tx.run(  "MATCH (p:Person { id: $id })" +
                        "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                        "RETURN p.id, p.name, collect(p2.id) as follows",
                parameters( "id", id));

                Record r = result.next();
                int id;
                String name;
                List follows = null;

                if(r.size()==0){
                    id = -1;
                    name = "null";
                }else{
                    id = r.get("p.id").asInt();
                    name = r.get("p.name").asString();
                    follows = r.get("follows").asList();
                    ArrayList<String> followsPerson = new ArrayList<>();

                    for(Object f : follows){
                        followsPerson.add(follows.toString());
                    }
                }
                return (new Person(id, name, follows));
            }
        });
        return personById;
    }

    //GET true/false if person exists in database
    public boolean personExists(int id){
        Session session = driver.session();
        boolean exist;
        exist = session.readTransaction(new TransactionWork<Boolean>(){
            @Override
            public Boolean execute(Transaction tx)
            {
                Result result = tx.run(  "MATCH (p:Person { id: $id })" +
                                "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                                "RETURN p.id, p.name, collect(p2.id) as follows",
                        parameters( "id", id));

                boolean exist;
               if(!result.hasNext()){
                   exist = false;
               }else{
                   exist = true;
               }
                return exist;
            }
        });
        return exist;
    }


    // CREATE a new person
    public Person create(int id, String name)
    {
        Person p;
        try ( Session session = driver.session() )
        {
            p = session.writeTransaction( new TransactionWork<Person>()
            {
                @Override
                public Person execute( Transaction tx )
                {
                    Result result = tx.run( "CREATE (a:Person) " +
                                    "SET a.id = $id, a.name = $name " +
                                    "RETURN a.id, a.name + ', from node ' + id(a)",
                            parameters( "name", name , "id", id) );
                    return (new Person(id, name, null));
                }
            });
            System.out.println("Person added -> ID: " + id + " name: " + name);
        }
        return p;
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

    // CREATE a following between two people by their ids
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

    // CREATE a following between two people by their ids
    public void deleteFollows(int id1, int id2)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id1})-[f:FOLLOWS]-(b:Person {id: $id2})" +
                                                    "DELETE f",
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

    public Integer getLastId(){
        int id;
        try ( Session session = driver.session() )
        {
            id = session.readTransaction( new TransactionWork<Integer>()
            {
                @Override
                public Integer execute(Transaction tx )
                {
                    Result result = tx.run( " MATCH (n:Person) RETURN n.id ORDER BY n.id DESC LIMIT 1");

                    if(result.hasNext()){
                        Record r = result.single();
                        return r.get("n.id").asInt();
                    }
                    return -1;
                }
            } );
            System.out.println("Last Id: " + id);
        }
        return id;
    }
}