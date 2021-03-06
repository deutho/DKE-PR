package com.example.accessingdataneo4j;

import org.neo4j.ogm.annotation.NodeEntity;

import java.util.ArrayList;
import java.util.List;

@NodeEntity
public class Person {

	private int id_person;
	private String name;
	private List followsPersons;
	private List followsHashtags;

	Person() {
		// Empty constructor required as of Neo4j API 2.0.5
	};

	public Person(int id_person, String name, List followsPersons, List followsHashtags){
		this.id_person = id_person;
		this.name = name;
		this.followsPersons = followsPersons;
		this.followsHashtags = followsHashtags;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getId_person(){ return id_person; }

	public void setId_person(int id_person){ this.id_person = id_person;}

	public List getFollowPersons(){
		return this.followsPersons;
	}
}