Feature: Room

  Background:
    Given I have empty place for room

  Scenario: Initiate room
    When I initiate room
    Then room.json exists
    And room.json has no clients
    And diograph.json exists
    And diograph.json has one diory
    And images folder exists
    And images folder has no files

  Scenario: Delete room
    When I initiate room
    And I delete room
    Then room.json not exists
    And diograph.json not exists
    And images folder not exists

  Scenario: Add client to room
    When I initiate room
    And I add client to room
    Then room.json has one client

  Scenario: List content source
    When I initiate room
    And I add client to room
    And I call list operation for client
    Then I receive list of files

  Scenario: Add diory from content source
    When I initiate room
    And I add client to room
    And I call import operation for one diory for client
    Then diograph.json has two diories
    And images folder has two images
