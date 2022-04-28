Feature: App

  Background:
    Given I have empty place for room
    And I initiate room

  Scenario: List rooms
    Then I can call appListRooms operation

  Scenario: List clients
    When I add client to room
    Then I can call appListClients operation

  Scenario: Content source contents list
    When I add client to room
    And I call listClientContents operation
    Then Content source diograph.json has 123 diories

  Scenario: Content source contents list 2
    When I add client to room
    And I call listClientContents2 operation
    Then Content source diograph.json has 123 diories

  Scenario: Content source contents list for both
    When I add client to room
    And I call listClientContents operation
    And I call listClientContents2 operation
    Then Content source diograph.json has 123 diories
