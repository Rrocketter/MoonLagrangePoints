import numpy as np

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

# Function to calculate Lagrange point L2
def lagrange_point_l2(moonlet_mass, distance_earth_moon):
    r_l2 = distance_earth_moon * ((M_earth + moonlet_mass) / (3 * M_moon))**(1/3)
    return r_l2

# Function to calculate orbital parameters at Lagrange point L2
def calculate_orbital_parameters_l2(moonlet_mass, distance_earth_moon):
    r_l2 = lagrange_point_l2(moonlet_mass, distance_earth_moon)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l2**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l2  # Orbital speed

    return omega, orbital_period, orbital_speed

# Example values
moonlet_mass_values = [1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 5e18, 1e19, 5e19]  # Example moonlet mass in kg

for moonlet_mass in moonlet_mass_values:
    # Calculate orbital parameters at Lagrange point L2
    angular_velocity, period, speed = calculate_orbital_parameters_l2(moonlet_mass, R_earth_moon)
    l2 = lagrange_point_l2(moonlet_mass, R_earth_moon)

    # Print the results to the console
    print(f"\nMoonlet Mass: {moonlet_mass} kg")
    print(f"Lagrange Point L2: {l2} meters")
    print(f"Angular Velocity (w) at Lagrange Point L2: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L2: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L2: {speed} m/s")

print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")

moonlet_mass_1 = 1e18
for distance_earth_moon in np.arange(3.84e8, 4.84e8, 1e6):
    # Calculate orbital parameters at Lagrange point L2
    angular_velocity, period, speed = calculate_orbital_parameters_l2(moonlet_mass_1, distance_earth_moon)
    l2 = lagrange_point_l2(moonlet_mass_1, distance_earth_moon)

    # Print the results to the console
    print(f"\nDistance Between Earth and Moon: {distance_earth_moon} meters")
    print(f"Lagrange Point L2: {l2} meters")
    print(f"Angular Velocity (w) at Lagrange Point L2: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L2: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L2: {speed} m/s")
