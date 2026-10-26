namespace backend.converters;

using System.Text.Json;
using System.Text.Json.Serialization;
using backend.engine.domain;

public class SymbolJsonConverter : JsonConverter<Symbol>
{
    public override void Write(
        Utf8JsonWriter writer,
        Symbol value,
        JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Name);
    }

    public override Symbol Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}