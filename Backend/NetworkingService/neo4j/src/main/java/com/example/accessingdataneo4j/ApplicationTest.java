package com.example.accessingdataneo4j;

public class ApplicationTest {

    public static void main( String... args ) throws Exception
    {
        //STATEMENTS
        try ( GraphDBTransactions person = new GraphDBTransactions( "bolt://localhost:7687", "neo4j", "secret" ) )
        {
            //DELETE all nodes before starting test
            person.emptyDB();

            //TEST NODES
            person.create(1, "Thomas");
            person.create(2, "Sabine");
            person.create(3,  "Samed");
            person.create(4, "Paul");
            person.create(5, "Franz");
            person.create(6, "Sepp");
            person.create(7, "Maria");
            person.create(8, "Anna");
            person.create(9, "Sophie");
            person.create(10, "Lisa");

            //TEST RELATIONSHIPS
            person.follows(1, 2);
            person.follows(2, 3);
            person.follows(3, 2);
            person.follows(10,3);
            person.follows(10,2);
            person.follows(10,7);
            person.follows(8, 1);
            person.follows(6, 7);
            person.follows(4, 7);
            person.follows(3, 9);
            person.follows(3, 6);
            person.follows(4, 3);

            //TEST DELETE
            person.delete(5);
        }
    }
}
