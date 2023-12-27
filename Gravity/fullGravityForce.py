import math

g = 0.000000000066743 #gravitational constant

# Define the mass of the moon and the mass of the earth
mMoon = 7.34767309 * 10 ** 22  # in kilograms
mEarth = 5.972 * 10 ** 24  # in kilograms

moon= 384400000.0  # in meters
moon2 = 0.75 * moon
moon3 = 1.25 * moon

def gravity(distance):
    # Calculate the total mass of the system
    massTotal = mEarth * mMoon

    # Calculate the numerator of the gravitational force equation
    forceNum = g * massTotal

    # Calculate the denominator of the gravitational force equation
    forceDen = distance ** 2

    # Calculate the gravitational force
    f = forceNum / forceDen

    # Print the result
    print("The gravitational force between the earth and moon is", f, "newtons.")

    return f

moonG = gravity(moon)
moon2G = gravity(moon2)
moon3G = gravity(moon3)

totalGravitationalForce = moonG + moon3G + moon2G
print("\nThe combined force of all the moons on Earth is ",totalGravitationalForce)