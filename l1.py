import numpy as np

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

# Function to calculate Lagrange point L1
def lagrange_point_l1(moonlet_mass, distance_earth_moon):
    r_l1 = distance_earth_moon * (M_moon / (3 * (M_earth + M_moon)))**(1/3)
    return r_l1

# Function to calculate orbital parameters at Lagrange point L1
def calculate_orbital_parameters(moonlet_mass, distance_earth_moon):
    r_l1 = lagrange_point_l1(moonlet_mass, distance_earth_moon)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_earth + moonlet_mass) / r_l1**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l1  # Orbital speed

    return omega, orbital_period, orbital_speed

# Example values
moonlet_mass = 1e18  # Example moonlet mass in kg

# Calculate orbital parameters at Lagrange point L1
angular_velocity, period, speed = calculate_orbital_parameters(moonlet_mass, R_earth_moon)

l1 = lagrange_point_l1(moonlet_mass, R_earth_moon)
print(l1)

# Print the results to the console
print(f"Angular Velocity (w) at Lagrange Point L1: {angular_velocity} rad/s")
print(f"Orbital Period at Lagrange Point L1: {period} seconds")
print(f"Orbital Speed at Lagrange Point L1: {speed} m/s")
