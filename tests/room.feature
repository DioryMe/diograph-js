Feature: Room

  Background:
    Given I have empty place for room

  Scenario: Initiate room
    When I initiate room
    Then room.json does exists
    And room.json has no clients
    And diograph.json does exists
    # And diograph.json has one diory
    # And images folder exists
    # And images folder has no files

  Scenario: Delete room
    When I initiate room
    And I delete room
    Then room.json not exists
    And diograph.json not exists
    # And images folder not exists

  Scenario: Add client to room
    When I initiate room
    And I add client to room
    Then room.json has 1 client

  Scenario: List and generate diograph from content source
    When I initiate room
    And I add client to room
    And I call list operation for client
    Then diograph.json does exists in application support room
    # And images folder is not empty in application support room

  Scenario: Add diory from content source
    When I initiate room
    And I add client to room
    Then I can call import operation for client
  #   Then diograph.json has two diories
  #   And images folder has one image
