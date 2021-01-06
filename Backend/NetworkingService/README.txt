neo4j configuration:

    - Run neo4j server:
         1. alternative in docker
             -  docker command: docker run --publish=7474:7474 --publish=7687:7687 -e 'NEO4J_AUTH=neo4j/secret' neo4j:4.1
         2. alternative neo4j desktop version

    - open localhost:7474
        - login to database (name: neo4j, password: secret)

    - install maven dependencies
    - run RunTestData for some test entries
    - test REST APIs of PersonController
