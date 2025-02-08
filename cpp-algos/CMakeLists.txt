cmake_minimum_required(VERSION 3.5)
project(cpp_algos)

set(CMAKE_CXX_STANDARD 11)

# Assuming Crow is in your include path (or add it as submodule)
include_directories(/usr/local/include)

add_executable(cpp_service src/main.cpp)