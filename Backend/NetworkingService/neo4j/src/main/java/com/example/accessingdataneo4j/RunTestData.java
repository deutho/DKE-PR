package com.example.accessingdataneo4j;

import java.util.List;
import java.util.ListIterator;

public class RunTestData {

    public static void main( String... args ) throws Exception
    {
        //STATEMENTS
        try ( GraphDBTransactions person = new GraphDBTransactions() )
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
//            person.follow(1, 2);
//            person.follow(2, 3);
//            person.follow(3, 2);
//            person.follow(10,3);
//            person.follow(10,2);
//            person.follow(10,7);
//            person.follow(8, 1);
//            person.follow(6, 7);
//            person.follow(4, 7);
//            person.follow(3, 9);
//            person.follow(3, 6);
//            person.follow(4, 3);
//
//            //TEST DELETE
//            person.delete(5);
//            person.delete(4);

            List<Person> persons = person.getAllPersons();
            ListIterator li = persons.listIterator();
            while(li.hasNext()){
               Person p = (Person) li.next();
               System.out.println(p.getId_person() + "/" +  p.getName());
            }
        }
    }
}
