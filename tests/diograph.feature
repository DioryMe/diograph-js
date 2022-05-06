Feature: Diograph

  Background:
    Given I have empty place for room
    And I initiate a room
    And diograph.json has 1 diories

  Scenario: Get diory
    When I call getDiory for diograph
    Then I receive a diory

  Scenario: Create diory
    When I call createDiory for diograph
    Then diograph.json has 2 diories

  # Scenario: Update diory
  #   When I call updateDiory for the last diory with "New name" as text
  #   Then last diory has "New name" as text

  # Scenario: Delete diory
  #   When I call deleteDiory for the last diory
  #   Then diograph.json has 0 diories

  Scenario: Import diory
    When I call importDiory
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 0 file

  Scenario: Import diory with content
    When I call importDiory with content
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 1 file
    And last diory has dioryId as image
    And last diory has dioryId as contentUrl
    And last diory has image/jpeg as encodingFormat

  # Scenario: Delete diory with content
  #   When I call importDiory with content
  #   And I call deleteDiory with content for last diory
  #   Then diograph.json has 1 diories
  #   And images folder has 0 image
  #   And content folder has 0 file
  #   And last diory has some-diory-id as id
  #   And last diory has "Root diory" as text
