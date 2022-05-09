Feature: Room

  Background:
    Given I have empty place for room
    And I initiate a room

  Scenario: Initiate room
    Then room.json does exists
    And room.json has no connections
    And diograph.json does exists
    # And diograph.json has one diory
    # And images folder exists
    # And images folder has no files

  Scenario: Delete room
    When I delete room
    Then room.json not exists
    And diograph.json not exists
    # And images folder not exists

  Scenario: Add connection to room
    When I add connection to room
    Then room.json has 1 connection

  Scenario: Content source contents list
    When I add connection to room
    And I call listClientContents operation
    Then Content source diograph.json has 6 diories
    # And images folder is not empty in application support room
    And room.json has 1 connection

  Scenario: Content source contents list 2
    When I add connection to room
    And I call listClientContents2 operation
    Then Content source diograph.json has 3 diories
    # And images folder is not empty in application support room
    And room.json has 1 connection

  Scenario: Content source contents list for both
    When I add connection to room
    And I call listClientContents operation
    And I call listClientContents2 operation
    Then Content source diograph.json has 8 diories
    # And images folder is not empty in application support room
    And room.json has 1 connection

  # Scenario: Add diory from content source
  #   When I add connection to room
  #   And I call import operation for client
  #   Then diograph.json has two diories
  #   And images folder has one image

  Scenario: Import diory
    When I call importDiory
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 0 file
    And room.json has 0 connection

  Scenario: Import diory with content
    When I call importDiory with content
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 1 file
    And last diory has dioryId as image
    And last diory has dioryId as contentUrl
    And last diory has image/jpeg as encodingFormat
    And room.json has 1 connection

  # Scenario: Delete diory with content
  #   When I call importDiory with content
  #   And I call deleteDiory with content for last diory
  #   Then diograph.json has 1 diories
  #   And images folder has 0 image
  #   And content folder has 0 file
  #   And last diory has some-diory-id as id
  #   And last diory has "Root diory" as text
