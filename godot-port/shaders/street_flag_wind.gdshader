shader_type canvas_item;
render_mode unshaded;

uniform sampler2D wind_map : filter_linear, repeat_disable;
uniform vec2 displacement_scale = vec2(0.005, 0.0025);

void fragment() {
	vec2 encoded_wind = texture(wind_map, UV).rg;
	vec2 displacement = (encoded_wind - vec2(0.5)) * 2.0 * displacement_scale;
	COLOR = texture(TEXTURE, clamp(UV + displacement, vec2(0.0), vec2(1.0))) * COLOR;
}
