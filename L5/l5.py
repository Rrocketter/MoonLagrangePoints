import numpy as np

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

# Function to calculate Lagrange point L5 location
def lagrange_point_l5_location():
    x_l5 = -0.5 * R_earth_moon
    y_l5 = (np.sqrt(3) / 2) * R_earth_moon
    return x_l5, y_l5

# Function to calculate orbital parameters at Lagrange point L5
def calculate_orbital_parameters_l5(moonlet_mass, distance_earth_moon):
    x_l5, y_l5 = lagrange_point_l5_location()

    # Use x_l5 and y_l5 as the coordinates of Lagrange point L5
    r_l5 = np.sqrt(x_l5**2 + y_l5**2)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l5**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l5  # Orbital speed

    return omega, orbital_period, orbital_speed, x_l5, y_l5

# Example values
moonlet_mass_values = [1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 5e18, 1e19, 5e19]  # Example moonlet mass in kg

for moonlet_mass in moonlet_mass_values:
    # Calculate orbital parameters at Lagrange point L5
    angular_velocity, period, speed, x_l5, y_l5 = calculate_orbital_parameters_l5(moonlet_mass, R_earth_moon)

    # Print the results to the console
    print(f"\nMoonlet Mass: {moonlet_mass} kg")
    print(f"Lagrange Point L5 Location: ({x_l5}, {y_l5}) meters")
    print(f"Angular Velocity (w) at Lagrange Point L5: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L5: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L5: {speed} m/s")

print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")

moonlet_mass_1 = 1e18
for distance_earth_moon in np.arange(3.84e8, 4.84e8, 1e6):
    # Calculate orbital parameters at Lagrange point L5
    angular_velocity, period, speed, x_l5, y_l5 = calculate_orbital_parameters_l5(moonlet_mass_1, distance_earth_moon)

    # Print the results to the console
    print(f"\nDistance Between Earth and Moon: {distance_earth_moon} meters")
    print(f"Lagrange Point L5 Location: ({x_l5}, {y_l5}) meters")
    print(f"Angular Velocity (w) at Lagrange Point L5: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L5: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L5: {speed} m/s")
