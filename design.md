# Biological System

## Classes
- Organism (contains BodyPartGroups and HealthSystem)
- BodyPart
  - name: String
  - healthPoints: number
  - fatalIfLost: boolean

- BodyPartGroup
  - name: String
  - bodyParts: Array<BodyPart>
  - function: ?HealthSystem

- HealthSystem
  - name: String
  - value: number
  - fatalIfIncapacitated: boolean


## Examples
- Organism:
  - Human
  - Animal

- BodyPartGroup and BodyPart(s):
  - Head
    - Skull
      - Brain
    - Jaw (Communication)
    - Nose (Smell)
    - Eye x2 (Sight)
    - Ear x2 (Hearing)
  - Neck
    - Upper Spine (required for Movement)
    - Throat
      - Esophagus (required for Eating)
      - Trachea (Breathing)
      - Voice Box (Communication)
  - Arm x2
    - Lower Arm
    - Upper Arm
    - Hand
      - Palm
      - Finger x5
  - Leg x2
    - Lower Leg
    - Upper Leg
    - Foot
      - Toes x5
  - Shoulders
  - Chest
    - Middle Spine
    - Sternum
    - Breasts
    - Ribs x12
    - Thymus (helps immune system)
    - Heart (required)
    - Lung x2 (one is required)
  - Abdomen
    - Lower Spine
    - Stomach (required to eat)
    - Kidney x2 (one is required)
    - Liver (required) (Metabolism, Immune System, Blood)
    - Pancreas (can live without)
  - Pelvis
    - Pelvis
    - Hip x2
    - Ovaries (if female)
- HealthSystem
  - Metabolism - How much energy the organism requires. Replenished by food

  - Immune System - the ability to prevent disease
    reduced by loss of thymus

  - Blood Filtration - the ability of the body to remove toxins from the body
    reduced by impairment of the heart

  - Blood Pumping
    reduced by heart impairment

  - Hearing - the capacity to hear

  - Smell - the ability to smell chemicals
    reduced by impairment of the nose
    eliminated by loss of nose

  - Eating - the capacity to eat
    reduced by a loss of an ear
    eliminated by loss of ears

  - Sight
    reduced by a loss an eye
    eliminated by loss of eyes
    required to identify objects in the vicinity

  - Communication
    reduced by loss of jaw or voice box

  - Breathing - the capacity to breath
    reduced by damaged or lost lungs
    reduces Movement slightly
    eliminated by loss of lungs

  - Manipulation
    reduced by a loss of arm or leg body parts
    eliminated by loss of all of arms or legs

  - Consciousness
    reduced by injuries or starvation
