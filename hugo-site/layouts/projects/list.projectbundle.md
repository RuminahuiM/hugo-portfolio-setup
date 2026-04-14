{{- $project := . -}}
# {{ $project.Title }}

{{ with $project.Params.description }}{{ . }}

{{ end }}{{ $project.RawContent }}

{{ range $project.RegularPages.ByWeight.ByDate }}
---

# {{ .Title }}

{{ .RawContent }}

{{ end }}
