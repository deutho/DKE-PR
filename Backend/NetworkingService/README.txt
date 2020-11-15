neo4j configuration:

    - run neo4j in docker
        -  docker command: docker run --publish=7474:7474 --publish=7687:7687 -e 'NEO4J_AUTH=neo4j/secret' neo4j:4.1
    - open localhost:7474
    - neo4j username: neo4j
    - neo4j password: secret
    - install maven dependencies
    - run Application Test
    - GraphDB generated on localhost:7474