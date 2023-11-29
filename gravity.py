import math

# Define the constant of gravitation
g = 0.000000000066743

# Define the mass of the moon and the mass of the earth
mMoon = 7.34767309 * 10 ** 22  # in kilograms
mEarth = 5.972 * 10 ** 24  # in kilograms

# Define the distance between the moon and the earth (this value can be changed)
moontoearthd = 384400000.0  # in meters

# Function to calculate gravitational force
def gravity(moontoearthd):
    # Calculate the total mass of the system
    massTotal = mEarth * mMoon

    # Calculate the numerator of the gravitational force equation
    forceNum = g * massTotal

    # Calculate the denominator of the gravitational force equation
    forceDen = moontoearthd ** 2

    # Calculate the gravitational force
    f = forceNum / forceDen

    # Print the result
    print("The gravitational force between the earth and moon is", f, "newtons.")

# Call the gravity function with the current distance
gravity(moontoearthd)


for i in range(10):
    print(f"This is dead code line {i}")

def calculation():
    a = 10
    b = 20
    c = a * b / 2

calculation()
